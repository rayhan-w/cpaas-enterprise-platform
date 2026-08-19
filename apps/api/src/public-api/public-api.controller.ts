import { Controller, Post, Body, Req, UseGuards, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { SendSmsPublicDto } from './dto/send-sms-public.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';

@Controller('v1/sms')
export class PublicApiController {
  private readonly SMS_RATE_INR = 0.12;

  constructor(
    private prisma: PrismaService,
    private smsService: SmsService,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ApiKeyGuard)
  async sendSms(@Req() req: any, @Body() dto: SendSmsPublicDto) {
    const user = req.user;

    // Check Sender ID
    const header = await this.prisma.dltHeader.findFirst({
      where: {
        userId: user.id,
        headerName: dto.sender_id.toUpperCase().trim(),
        status: 'ACTIVE',
      },
    });

    if (!header) {
      throw new BadRequestException(
        `Sender ID "${dto.sender_id}" is not registered or approved for this account`,
      );
    }

    // Check Template if provided
    let finalMessage = dto.message || '';
    if (dto.template_id) {
      const template = await this.prisma.dltTemplate.findFirst({
        where: {
          userId: user.id,
          OR: [
            { id: dto.template_id },
            { templateIdCode: dto.template_id },
          ],
        },
      });

      if (!template) {
        throw new BadRequestException(`DLT Template "${dto.template_id}" not found`);
      }

      finalMessage = this.smsService.interpolateTemplate(template.content, dto.variables || []);
    }

    if (!finalMessage.trim()) {
      throw new BadRequestException('Message content cannot be empty');
    }

    // Check Balance
    if (user.smsCredit < 1 && user.balanceInr < this.SMS_RATE_INR) {
      throw new BadRequestException(
        `Insufficient credits. Current balance: ${user.smsCredit} SMS credits / INR ₹${user.balanceInr.toFixed(2)}`,
      );
    }

    const cleanPhone = this.formatPhoneNumber(dto.recipient);

    // Deduct credits
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        smsCredit: Math.max(0, user.smsCredit - 1),
        balanceInr: Math.max(0, user.balanceInr - (user.smsCredit < 1 ? this.SMS_RATE_INR : 0)),
      },
    });

    // Determine status (simulate delivery)
    let status = 'DELIVERED';
    let errorMessage: string | null = null;

    if (header.headerType === 'PROMOTIONAL' && (cleanPhone.endsWith('09') || cleanPhone.endsWith('99'))) {
      status = 'DND_FILTERED';
      errorMessage = 'Recipient active on National DND Registry (TRAI Regulation)';
    } else if (cleanPhone.endsWith('0000')) {
      status = 'FAILED';
      errorMessage = 'Invalid or unreachable mobile operator MSISDN';
    }

    const messageLog = await this.prisma.messageLog.create({
      data: {
        userId: user.id,
        recipient: cleanPhone,
        message: finalMessage,
        status,
        cost: status === 'DND_FILTERED' || status === 'FAILED' ? 0.0 : this.SMS_RATE_INR,
        source: 'API',
        errorMessage,
      },
    });

    return {
      status: status === 'FAILED' ? 'FAILED' : 'SUCCESS',
      message_id: messageLog.id,
      recipient: cleanPhone,
      sender_id: header.headerName,
      delivery_status: status,
      cost_inr: messageLog.cost,
      remaining_credits: updatedUser.smsCredit,
      remaining_balance_inr: updatedUser.balanceInr,
      error: errorMessage,
      timestamp: messageLog.createdAt.toISOString(),
    };
  }

  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('91') && digits.length === 12) return digits;
    if (digits.startsWith('0') && digits.length === 11) return `91${digits.substring(1)}`;
    return digits;
  }
}
