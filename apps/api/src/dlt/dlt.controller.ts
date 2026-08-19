import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DltService } from './dlt.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateHeaderDto } from './dto/create-header.dto';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('dlt')
@UseGuards(JwtAuthGuard)
export class DltController {
  constructor(private readonly dltService: DltService) {}

  // Headers
  @Get('headers')
  async getHeaders(@CurrentUser('id') userId: string) {
    return this.dltService.getHeaders(userId);
  }

  @Post('headers')
  async createHeader(@CurrentUser('id') userId: string, @Body() dto: CreateHeaderDto) {
    return this.dltService.createHeader(userId, dto);
  }

  @Delete('headers/:id')
  async deleteHeader(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.dltService.deleteHeader(userId, id);
  }

  // Templates
  @Get('templates')
  async getTemplates(@CurrentUser('id') userId: string) {
    return this.dltService.getTemplates(userId);
  }

  @Post('templates')
  async createTemplate(@CurrentUser('id') userId: string, @Body() dto: CreateTemplateDto) {
    return this.dltService.createTemplate(userId, dto);
  }

  @Delete('templates/:id')
  async deleteTemplate(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.dltService.deleteTemplate(userId, id);
  }
}
