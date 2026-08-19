import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(60000);

describe('CPaaS Enterprise Platform (E2E Integration Flow)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let authToken: string;
  let userId: string;
  let headerId: string;
  let templateId: string;
  let rawApiKey: string;
  let paymentOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');

    prisma = app.get(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Register new enterprise account', async () => {
    const email = `test_enterprise_${Date.now()}@cpaas.io`;
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Nexus Corp',
        email,
        password: 'Password@123',
        entityId: '1701199990001',
      })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(email);

    authToken = res.body.accessToken;
    userId = res.body.user.id;
  });

  it('2. Login to get JWT Token', async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'Password@123',
      })
      .expect(200);

    expect(res.body).toHaveProperty('accessToken');
    authToken = res.body.accessToken;
  });

  it('3. Register DLT Sender ID (6-char alphanumeric)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/dlt/headers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        headerName: 'NXTEST',
        headerType: 'TRANSACTIONAL',
      })
      .expect(201);

    expect(res.body.headerName).toBe('NXTEST');
    headerId = res.body.id;
  });

  it('4. Register DLT Content Template with {#var#} variables', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/dlt/templates')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        headerId,
        templateIdCode: '140716158291099',
        templateName: 'E2E OTP Template',
        templateType: 'TRANSACTIONAL',
        content: 'Dear {#var#}, your security OTP code is {#var#}. Valid 10m. - NXTEST',
      })
      .expect(201);

    expect(res.body.templateName).toBe('E2E OTP Template');
    templateId = res.body.id;
  });

  it('5. Create and dispatch SMS campaign & deduct credits', async () => {
    const initialUser = await prisma.user.findUnique({ where: { id: userId } });
    const initialCredits = initialUser.smsCredit;

    const res = await request(app.getHttpServer())
      .post('/api/sms/campaigns')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'E2E Launch Campaign',
        senderId: headerId,
        templateId,
        messageType: 'SEND_NOW',
        recipients: [
          { phoneNumber: '919876543210', variables: ['Rohan', '123456'] },
          { phoneNumber: '919812345678', variables: ['Sneha', '654321'] },
        ],
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.totalRecipients).toBe(2);
    expect(res.body.creditsDeducted).toBe(2);

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    expect(updatedUser.smsCredit).toBe(initialCredits - 2);
  });

  it('6. Generate Developer API Key and verify one-time token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/api-keys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Staging ERP SaaS Key',
        permissions: 'sms:send,sms:read',
      })
      .expect(201);

    expect(res.body).toHaveProperty('rawApiKey');
    expect(res.body.rawApiKey).toContain('cpaas_live_');
    rawApiKey = res.body.rawApiKey;
  });

  it('7. Invoke Public REST API endpoint POST /api/v1/sms/send using X-API-Key', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/sms/send')
      .set('X-API-Key', rawApiKey)
      .send({
        recipient: '919999888877',
        sender_id: 'NXTEST',
        template_id: templateId,
        variables: ['Developer', '998877'],
      })
      .expect(200);

    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.sender_id).toBe('NXTEST');
    expect(res.body).toHaveProperty('message_id');
  });

  it('8. Create Payment Recharge Order & Verify Webhook', async () => {
    // Create order for INR 500
    const orderRes = await request(app.getHttpServer())
      .post('/api/payments/create-order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amountInr: 500,
        gateway: 'RAZORPAY',
      })
      .expect(201);

    expect(orderRes.body).toHaveProperty('orderId');
    expect(orderRes.body.amountInr).toBe(500);
    paymentOrderId = orderRes.body.orderId;

    // Simulate Payment Verification
    const verifyRes = await request(app.getHttpServer())
      .post('/api/payments/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        orderId: paymentOrderId,
        paymentId: 'pay_test_rzp_mock_123',
        signature: 'mock_sig_valid_for_test',
        gateway: 'RAZORPAY',
      })
      .expect(201);

    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.smsCreditsCredited).toBe(Math.floor(500 / 0.12));
  });

  it('9. Export Reports to CSV and verify headers', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/reports/export/csv')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text).toContain('Message ID,Recipient,Message Content,Status');
  });
});
