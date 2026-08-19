import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHeaderDto } from './dto/create-header.dto';
import { CreateTemplateDto } from './dto/create-template.dto';

@Injectable()
export class DltService {
  constructor(private prisma: PrismaService) {}

  // Headers (Sender IDs)
  async getHeaders(userId: string) {
    return this.prisma.dltHeader.findMany({
      where: { userId },
      include: {
        _count: {
          select: { templates: true, campaigns: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createHeader(userId: string, dto: CreateHeaderDto) {
    const uppercaseHeader = dto.headerName.toUpperCase().trim();
    
    // Check if already registered by this user
    const existing = await this.prisma.dltHeader.findFirst({
      where: { userId, headerName: uppercaseHeader },
    });

    if (existing) {
      throw new BadRequestException(`Sender ID ${uppercaseHeader} is already added in your account`);
    }

    const header = await this.prisma.dltHeader.create({
      data: {
        userId,
        headerName: uppercaseHeader,
        headerType: dto.headerType,
        status: 'ACTIVE', // Instantly active for demo/staging
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'DLT_HEADER_ADDED',
        details: `Registered DLT Sender ID: ${header.headerName} (${header.headerType})`,
      },
    });

    return header;
  }

  async deleteHeader(userId: string, headerId: string) {
    const header = await this.prisma.dltHeader.findFirst({
      where: { id: headerId, userId },
    });

    if (!header) {
      throw new NotFoundException('Header not found or does not belong to you');
    }

    await this.prisma.dltHeader.delete({
      where: { id: headerId },
    });

    return { success: true, message: 'Header deleted successfully' };
  }

  // Templates
  async getTemplates(userId: string) {
    return this.prisma.dltTemplate.findMany({
      where: { userId },
      include: {
        header: {
          select: {
            id: true,
            headerName: true,
            headerType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(userId: string, dto: CreateTemplateDto) {
    const header = await this.prisma.dltHeader.findFirst({
      where: { id: dto.headerId, userId },
    });

    if (!header) {
      throw new NotFoundException('Selected DLT Header / Sender ID not found in your account');
    }

    const template = await this.prisma.dltTemplate.create({
      data: {
        userId,
        headerId: dto.headerId,
        templateIdCode: dto.templateIdCode.trim(),
        templateName: dto.templateName.trim(),
        templateType: dto.templateType,
        content: dto.content.trim(),
        status: 'ACTIVE',
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'DLT_TEMPLATE_ADDED',
        details: `Added DLT Template: ${template.templateName} (${template.templateIdCode})`,
      },
    });

    return template;
  }

  async deleteTemplate(userId: string, templateId: string) {
    const template = await this.prisma.dltTemplate.findFirst({
      where: { id: templateId, userId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.prisma.dltTemplate.delete({
      where: { id: templateId },
    });

    return { success: true, message: 'Template deleted successfully' };
  }
}
