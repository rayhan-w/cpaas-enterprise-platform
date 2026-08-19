import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for CPaaS Enterprise Platform...');

  // Clean existing
  await prisma.activityLog.deleteMany();
  await prisma.paymentOrder.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.messageLog.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.contactGroup.deleteMany();
  await prisma.dltTemplate.deleteMany();
  await prisma.dltHeader.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@123456', salt);

  // 1. Create Default Enterprise User (and Admin)
  const user = await prisma.user.create({
    data: {
      id: 'usr_cpaas_enterprise_demo_01',
      name: 'Enterprise Admin',
      email: 'admin@cpaas.io',
      passwordHash,
      role: 'ADMIN',
      entityId: '17011582910283',
      balanceInr: 1692.08,
      smsCredit: 14101,
      status: 'ACTIVE',
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      id: 'usr_cpaas_user_demo_02',
      name: 'Rahul Sharma (FinTech Corp)',
      email: 'user@cpaas.io',
      passwordHash,
      role: 'USER',
      entityId: '17011582910283',
      balanceInr: 500.00,
      smsCredit: 4166,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created Users:', user.email, normalUser.email);

  // 2. DLT Headers (Sender IDs - 6 alphanumeric characters)
  const header1 = await prisma.dltHeader.create({
    data: {
      userId: user.id,
      headerName: 'TFISMS',
      headerType: 'TRANSACTIONAL',
      status: 'ACTIVE',
    },
  });

  const header2 = await prisma.dltHeader.create({
    data: {
      userId: user.id,
      headerName: 'PAYNTX',
      headerType: 'SERVICE_IMPLICIT',
      status: 'ACTIVE',
    },
  });

  const header3 = await prisma.dltHeader.create({
    data: {
      userId: user.id,
      headerName: 'CPMDMO',
      headerType: 'PROMOTIONAL',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created DLT Headers:', header1.headerName, header2.headerName, header3.headerName);

  // 3. DLT Content Templates
  const template1 = await prisma.dltTemplate.create({
    data: {
      userId: user.id,
      headerId: header1.id,
      templateIdCode: '140716158291028',
      templateName: 'OTP Authentication Verification',
      templateType: 'TRANSACTIONAL',
      content: 'Dear {#var#}, your login OTP for CPaaS Enterprise is {#var#}. Valid for 10 minutes. Do not share with anyone. - TFISMS',
      status: 'ACTIVE',
    },
  });

  const template2 = await prisma.dltTemplate.create({
    data: {
      userId: user.id,
      headerId: header2.id,
      templateIdCode: '140716158291029',
      templateName: 'Payment Success Alert',
      templateType: 'SERVICE_IMPLICIT',
      content: 'Dear Customer, your payment of INR {#var#} for Invoice #{#var#} is successful. Available wallet balance is INR {#var#}. - PAYNTX',
      status: 'ACTIVE',
    },
  });

  const template3 = await prisma.dltTemplate.create({
    data: {
      userId: user.id,
      headerId: header3.id,
      templateIdCode: '140716158291030',
      templateName: 'Seasonal Flash Discount Sale',
      templateType: 'PROMOTIONAL',
      content: 'Hey {#var#}, enjoy {#var#}% OFF on all bulk SMS recharges this weekend! Use code {#var#} at checkout. - CPMDMO',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created DLT Templates');

  // 4. Contact Groups & Contacts
  const group1 = await prisma.contactGroup.create({
    data: {
      userId: user.id,
      name: 'VIP Enterprise Clients',
      code: 'VIP_01',
    },
  });

  const group2 = await prisma.contactGroup.create({
    data: {
      userId: user.id,
      name: 'Bangalore Tech Leads',
      code: 'BLR_LEADS',
    },
  });

  await prisma.contact.createMany({
    data: [
      {
        groupId: group1.id,
        phoneNumber: '919876543210',
        name: 'Aarav Patel',
        customVars: JSON.stringify({ company: 'Acme Corp', discount: '20' }),
      },
      {
        groupId: group1.id,
        phoneNumber: '919812345678',
        name: 'Priya Sharma',
        customVars: JSON.stringify({ company: 'Starlight Tech', discount: '25' }),
      },
      {
        groupId: group2.id,
        phoneNumber: '919988776655',
        name: 'Vikram Mehta',
        customVars: JSON.stringify({ company: 'Nexus Logistics', discount: '15' }),
      },
      {
        groupId: group2.id,
        phoneNumber: '919765432109',
        name: 'Ananya Rao',
        customVars: JSON.stringify({ company: 'Apex Cloud', discount: '30' }),
      },
    ],
  });

  console.log('✅ Created Contact Groups & Contacts');

  // 5. Campaigns & Message Logs (Sent, Delivered, Failed, DND_Filtered)
  const campaign = await prisma.campaign.create({
    data: {
      userId: user.id,
      senderId: header1.id,
      templateId: template1.id,
      name: 'OTP Service Broadcast Test',
      messageType: 'SEND_NOW',
      recipientCount: 4,
      creditsUsed: 4,
      costInr: 0.48,
      status: 'COMPLETED',
    },
  });

  await prisma.messageLog.createMany({
    data: [
      {
        userId: user.id,
        campaignId: campaign.id,
        recipient: '919876543210',
        message: 'Dear Aarav Patel, your login OTP for CPaaS Enterprise is 849201. Valid for 10 minutes. Do not share with anyone. - TFISMS',
        status: 'DELIVERED',
        cost: 0.12,
        source: 'UI',
      },
      {
        userId: user.id,
        campaignId: campaign.id,
        recipient: '919812345678',
        message: 'Dear Priya Sharma, your login OTP for CPaaS Enterprise is 392019. Valid for 10 minutes. Do not share with anyone. - TFISMS',
        status: 'DELIVERED',
        cost: 0.12,
        source: 'UI',
      },
      {
        userId: user.id,
        campaignId: campaign.id,
        recipient: '919988776655',
        message: 'Dear Vikram Mehta, your login OTP for CPaaS Enterprise is 109284. Valid for 10 minutes. Do not share with anyone. - TFISMS',
        status: 'SENT',
        cost: 0.12,
        source: 'UI',
      },
      {
        userId: user.id,
        campaignId: campaign.id,
        recipient: '919765432109',
        message: 'Dear Ananya Rao, your login OTP for CPaaS Enterprise is 582910. Valid for 10 minutes. Do not share with anyone. - TFISMS',
        status: 'DND_FILTERED',
        cost: 0.0,
        source: 'UI',
        errorMessage: 'Recipient active on National DND Registry (TRAI Regulation)',
      },
      {
        userId: user.id,
        recipient: '919123456789',
        message: 'Dear Rahul, your payment of INR 500.00 for Invoice #INV-9021 is successful. Available wallet balance is INR 1692.08. - PAYNTX',
        status: 'DELIVERED',
        cost: 0.12,
        source: 'API',
      },
      {
        userId: user.id,
        recipient: '919000000000',
        message: 'Dear Customer, your OTP is 112233. - TFISMS',
        status: 'FAILED',
        cost: 0.0,
        source: 'API',
        errorMessage: 'Invalid or unreachable mobile operator MSISDN',
      },
    ],
  });

  console.log('✅ Created Campaign & Message Logs');

  // 6. Developer API Key
  const rawApiKey = 'cpaas_live_a1b2c3d4e5f67890abcdef1234567890';
  const keyHash = crypto.createHash('sha256').update(rawApiKey).digest('hex');

  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: 'Production SaaS Gateway Key',
      keyHash,
      keyPrefix: 'cpaas_li...',
      permissions: 'sms:send,sms:read,reports:read',
      isActive: true,
    },
  });

  console.log('✅ Created Developer API Key: cpaas_live_a1b2c3d4e5f67890abcdef1234567890');

  // 7. Payment Order History
  await prisma.paymentOrder.create({
    data: {
      userId: user.id,
      orderId: 'order_cpaas_demo_98231',
      gateway: 'RAZORPAY',
      amountInr: 1000.00,
      smsCreditsCredited: 8333,
      status: 'SUCCESS',
      paymentId: 'pay_rzp_mock_82910482',
      signature: 'mock_signature_valid_sha256_hash',
    },
  });

  // 8. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: user.id,
        action: 'LOGIN',
        ipAddress: '127.0.0.1',
        details: 'Admin user logged in via Web Portal',
      },
      {
        userId: user.id,
        action: 'WALLET_RECHARGE',
        ipAddress: '127.0.0.1',
        details: 'Successfully recharged INR 1000.00 (+8333 SMS Credits) via Razorpay',
      },
      {
        userId: user.id,
        action: 'API_KEY_CREATED',
        ipAddress: '127.0.0.1',
        details: 'Generated new API token: Production SaaS Gateway Key',
      },
      {
        userId: user.id,
        action: 'CAMPAIGN_DISPATCHED',
        ipAddress: '127.0.0.1',
        details: 'Dispatched campaign: OTP Service Broadcast Test (4 recipients)',
      },
    ],
  });

  console.log('✅ Created Activity Logs');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
