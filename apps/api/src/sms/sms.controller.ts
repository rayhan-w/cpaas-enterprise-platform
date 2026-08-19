import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller('sms')
@UseGuards(JwtAuthGuard)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('campaigns')
  async createCampaign(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.smsService.createAndDispatchCampaign(userId, dto);
  }

  @Get('campaigns')
  async getCampaigns(@CurrentUser('id') userId: string) {
    return this.smsService.getCampaigns(userId);
  }

  @Get('campaigns/:id')
  async getCampaignDetails(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.smsService.getCampaignDetails(userId, id);
  }
}
