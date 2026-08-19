import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportQueryDto } from './dto/report-query.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('messages')
  async getMessageReports(
    @CurrentUser('id') userId: string,
    @Query() query: ReportQueryDto,
  ) {
    return this.reportsService.getMessageReports(userId, query);
  }

  @Get('stats')
  async getAnalyticsStats(@CurrentUser('id') userId: string) {
    return this.reportsService.getAnalyticsStats(userId);
  }

  @Get('export/csv')
  async exportCsv(
    @CurrentUser('id') userId: string,
    @Query() query: ReportQueryDto,
    @Res() res: Response,
  ) {
    const csvData = await this.reportsService.exportMessagesCsv(userId, query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="cpaas_sms_report_${Date.now()}.csv"`);
    return res.send(csvData);
  }

  @Get('activity')
  async getActivityLogs(@CurrentUser('id') userId: string) {
    return this.reportsService.getActivityLogs(userId);
  }
}
