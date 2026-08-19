import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, CampaignRecipient } from './dto/create-campaign.dto';

@Injectable()
export class SmsService {
  private readonly SMS_RATE_INR = 0.12;

  constructor(private prisma: PrismaService) {}

  async createAndDispatchCampaign(userId: string, dto: CreateCampaignDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify Sender ID
    const header = await this.prisma.dltHeader.findFirst({
      where: {
        userId,
        OR: [{ id: dto.senderId }, { headerName: dto.senderId.toUpperCase() }],
      },
    });

    if (!header) {
      throw new BadRequestException('Sender ID (DLT Header) not found or inactive');
    }

    // Verify Template if specified
    let template = null;
    if (dto.templateId) {
      template = await this.prisma.dltTemplate.findFirst({
        where: { id: dto.templateId, userId },
      });
      if (!template) {
        throw new BadRequestException('DLT Template not found');
      }
    }

    // Resolve Recipient List
    let targetRecipients: { phoneNumber: string; message: string; name?: string }[] = [];

    if (dto.groupId) {
      const contacts = await this.prisma.contact.findMany({
        where: { groupId: dto.groupId },
      });

      if (contacts.length === 0) {
        throw new BadRequestException('Selected contact group is empty');
      }

      for (const contact of contacts) {
        let vars: string[] = [];
        if (contact.customVars) {
          try {
            const parsed = JSON.parse(contact.customVars);
            vars = Object.values(parsed).map((v) => String(v));
          } catch {
            vars = [contact.name || 'Customer'];
          }
        } else {
          vars = [contact.name || 'Customer'];
        }

        const populatedMsg = template
          ? this.interpolateTemplate(template.content, vars)
          : dto.customMessage || 'Message';

        targetRecipients.push({
          phoneNumber: contact.phoneNumber,
          message: populatedMsg,
          name: contact.name || undefined,
        });
      }
    } else if (dto.recipients && dto.recipients.length > 0) {
      for (const r of dto.recipients) {
        const cleanPhone = this.formatPhoneNumber(r.phoneNumber);
        let populatedMsg = dto.customMessage || '';

        if (template) {
          populatedMsg = this.interpolateTemplate(template.content, r.variables || []);
        }

        targetRecipients.push({
          phoneNumber: cleanPhone,
          message: populatedMsg,
        });
      }
    } else {
      throw new BadRequestException('No recipients provided for campaign');
    }

    const totalCount = targetRecipients.length;
    const requiredCredits = totalCount;
    const estimatedCost = totalCount * this.SMS_RATE_INR;

    // Check Balance & Credits
    if (user.smsCredit < requiredCredits && user.balanceInr < estimatedCost) {
      throw new BadRequestException(
        `Insufficient SMS Credits/Balance. Required: ${requiredCredits} Credits (INR ₹${estimatedCost.toFixed(2)}). Current available: ${user.smsCredit} credits / ₹${user.balanceInr.toFixed(2)}`,
      );
    }

    // Create Campaign Record
    const campaign = await this.prisma.campaign.create({
      data: {
        userId,
        senderId: header.id,
        templateId: template?.id || null,
        name: dto.name.trim(),
        messageType: dto.messageType,
        recipientCount: totalCount,
        creditsUsed: requiredCredits,
        costInr: estimatedCost,
        status: 'PROCESSING',
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
      },
    });

    // Deduct user credits / balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        smsCredit: Math.max(0, user.smsCredit - requiredCredits),
        balanceInr: Math.max(0, user.balanceInr - (user.smsCredit < requiredCredits ? estimatedCost : 0)),
      },
    });

    // Dispatch & Generate Message Logs (Simulated telco routing)
    const logsData = targetRecipients.map((rec) => {
      const outcome = this.simulateDeliveryOutcome(rec.phoneNumber, header.headerType);
      return {
        userId,
        campaignId: campaign.id,
        recipient: rec.phoneNumber,
        message: rec.message,
        status: outcome.status,
        cost: outcome.status === 'DND_FILTERED' || outcome.status === 'FAILED' ? 0.0 : this.SMS_RATE_INR,
        source: 'UI',
        errorMessage: outcome.errorMessage || null,
      };
    });

    await this.prisma.messageLog.createMany({
      data: logsData,
    });

    // Mark campaign completed
    await this.prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: 'COMPLETED' },
    });

    // Activity Log
    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'CAMPAIGN_DISPATCHED',
        details: `Campaign "${campaign.name}" dispatched to ${totalCount} recipients via ${header.headerName}`,
      },
    });

    const statusCounts = logsData.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      campaignId: campaign.id,
      campaignName: campaign.name,
      senderId: header.headerName,
      totalRecipients: totalCount,
      summary: {
        delivered: statusCounts['DELIVERED'] || 0,
        sent: statusCounts['SENT'] || 0,
        dndFiltered: statusCounts['DND_FILTERED'] || 0,
        failed: statusCounts['FAILED'] || 0,
      },
      creditsDeducted: requiredCredits,
      remainingCredits: Math.max(0, user.smsCredit - requiredCredits),
    };
  }

  async getCampaigns(userId: string) {
    return this.prisma.campaign.findMany({
      where: { userId },
      include: {
        header: { select: { headerName: true, headerType: true } },
        template: { select: { templateName: true, templateIdCode: true } },
        _count: { select: { messageLogs: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getCampaignDetails(userId: string, campaignId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id: campaignId, userId },
      include: {
        header: true,
        template: true,
        messageLogs: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  public interpolateTemplate(templateContent: string, vars: string[] | Record<string, string>): string {
    if (!templateContent) return '';
    let result = templateContent;

    if (Array.isArray(vars)) {
      vars.forEach((v) => {
        result = result.replace(/\{#var#\}/, String(v || ''));
      });
    } else if (typeof vars === 'object' && vars !== null) {
      Object.entries(vars).forEach(([key, val]) => {
        result = result.replace(new RegExp(`\\{#${key}#\\}`, 'g'), String(val));
        result = result.replace(/\{#var#\}/, String(val));
      });
    }

    // Replace any remaining unreplaced {#var#} with empty or default placeholder
    result = result.replace(/\{#var#\}/g, '');
    return result;
  }

  private simulateDeliveryOutcome(phoneNumber: string, headerType: string): { status: string; errorMessage?: string } {
    // DND Filter simulation for promotional routes
    if (headerType === 'PROMOTIONAL' && (phoneNumber.endsWith('09') || phoneNumber.endsWith('99'))) {
      return {
        status: 'DND_FILTERED',
        errorMessage: 'Recipient active on National DND Registry (TRAI Regulation)',
      };
    }

    // Invalid mobile simulation
    if (phoneNumber.endsWith('0000')) {
      return {
        status: 'FAILED',
        errorMessage: 'Invalid MSISDN or unallocated network routing prefix',
      };
    }

    // Random slight jitter between DELIVERED (90%) and SENT (10%)
    if (phoneNumber.endsWith('55')) {
      return { status: 'SENT' };
    }

    return { status: 'DELIVERED' };
  }

  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.startsWith('91') && digits.length === 12) return digits;
    if (digits.startsWith('0') && digits.length === 11) return `91${digits.substring(1)}`;
    return digits;
  }
}
