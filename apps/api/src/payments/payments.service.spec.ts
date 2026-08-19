import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService Unit Tests', () => {
  let service: PaymentsService;
  let prismaMock: any;
  let configMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      paymentOrder: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      activityLog: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    configMock = {
      get: jest.fn((key: string) => {
        if (key === 'RAZORPAY_KEY_ID') return 'rzp_test_mock_123';
        if (key === 'RAZORPAY_KEY_SECRET') return 'sample_razorpay_secret_key_892318';
        if (key === 'RAZORPAY_WEBHOOK_SECRET') return 'rzp_webhook_secret_cpaas_2026';
        return null;
      }),
    };

    service = new PaymentsService(prismaMock as PrismaService, configMock as ConfigService);
  });

  describe('createRechargeOrder', () => {
    it('should correctly convert INR amount to SMS credits at ₹0.12/SMS rate', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'usr_test_01',
        name: 'Demo Admin',
        email: 'admin@cpaas.io',
      });

      prismaMock.paymentOrder.create.mockImplementation((args: any) => ({
        ...args.data,
        id: 'order_db_id_1',
      }));

      const result = await service.createRechargeOrder('usr_test_01', {
        amountInr: 500,
        gateway: 'RAZORPAY',
      });

      expect(result.amountInr).toBe(500);
      expect(result.smsCreditsCredited).toBe(Math.floor(500 / 0.12)); // 4166 credits
      expect(result.gateway).toBe('RAZORPAY');
    });
  });
});
