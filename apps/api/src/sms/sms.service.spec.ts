import { SmsService } from './sms.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SmsService Unit Tests', () => {
  let service: SmsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      dltHeader: {
        findFirst: jest.fn(),
      },
      dltTemplate: {
        findFirst: jest.fn(),
      },
      campaign: {
        create: jest.fn(),
        update: jest.fn(),
      },
      messageLog: {
        createMany: jest.fn(),
      },
      activityLog: {
        create: jest.fn(),
      },
    };

    service = new SmsService(prismaMock as PrismaService);
  });

  describe('interpolateTemplate', () => {
    it('should correctly replace sequential {#var#} placeholders with array values', () => {
      const template = 'Dear {#var#}, your OTP code is {#var#}. Valid for 10 mins.';
      const vars = ['Aarav', '948201'];
      const result = service.interpolateTemplate(template, vars);
      expect(result).toBe('Dear Aarav, your OTP code is 948201. Valid for 10 mins.');
    });

    it('should clean up unused placeholders', () => {
      const template = 'Hello {#var#}, thanks for choosing {#var#}!';
      const vars = ['Priya'];
      const result = service.interpolateTemplate(template, vars);
      expect(result).toBe('Hello Priya, thanks for choosing !');
    });

    it('should handle named variable keys if passed as object', () => {
      const template = 'Hi {#name#}, your balance is INR {#amount#}.';
      const vars = { name: 'Vikram', amount: '500' };
      const result = service.interpolateTemplate(template, vars);
      expect(result).toBe('Hi Vikram, your balance is INR 500.');
    });
  });
});
