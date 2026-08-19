import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { BulkContactsDto } from './dto/bulk-contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  // Groups
  async getGroups(userId: string) {
    return this.prisma.contactGroup.findMany({
      where: { userId },
      include: {
        _count: {
          select: { contacts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGroup(userId: string, dto: CreateGroupDto) {
    return this.prisma.contactGroup.create({
      data: {
        userId,
        name: dto.name.trim(),
        code: dto.code.trim().toUpperCase(),
      },
    });
  }

  async deleteGroup(userId: string, groupId: string) {
    const group = await this.prisma.contactGroup.findFirst({
      where: { id: groupId, userId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.prisma.contactGroup.delete({
      where: { id: groupId },
    });

    return { success: true, message: 'Group deleted successfully' };
  }

  // Contacts
  async getContactsByGroup(userId: string, groupId: string, search?: string) {
    const group = await this.prisma.contactGroup.findFirst({
      where: { id: groupId, userId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    return this.prisma.contact.findMany({
      where: {
        groupId,
        ...(search && {
          OR: [
            { phoneNumber: { contains: search } },
            { name: { contains: search } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async createContact(userId: string, dto: CreateContactDto) {
    const group = await this.prisma.contactGroup.findFirst({
      where: { id: dto.groupId, userId },
    });

    if (!group) {
      throw new NotFoundException('Target group not found in your account');
    }

    const cleanPhone = this.formatPhoneNumber(dto.phoneNumber);

    const customVarsString = typeof dto.customVars === 'object'
      ? JSON.stringify(dto.customVars)
      : dto.customVars || null;

    return this.prisma.contact.create({
      data: {
        groupId: dto.groupId,
        phoneNumber: cleanPhone,
        name: dto.name?.trim() || null,
        customVars: customVarsString,
      },
    });
  }

  async bulkImportContacts(userId: string, dto: BulkContactsDto) {
    const group = await this.prisma.contactGroup.findFirst({
      where: { id: dto.groupId, userId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (!dto.contacts || dto.contacts.length === 0) {
      throw new BadRequestException('No contacts provided');
    }

    const formattedData = dto.contacts.map((c) => ({
      groupId: dto.groupId,
      phoneNumber: this.formatPhoneNumber(c.phoneNumber),
      name: c.name?.trim() || null,
      customVars: typeof c.customVars === 'object' ? JSON.stringify(c.customVars) : c.customVars || null,
    }));

    const result = await this.prisma.contact.createMany({
      data: formattedData,
    });

    await this.prisma.activityLog.create({
      data: {
        userId,
        action: 'CONTACTS_IMPORTED',
        details: `Imported ${result.count} contacts to group "${group.name}"`,
      },
    });

    return {
      success: true,
      importedCount: result.count,
      groupId: dto.groupId,
    };
  }

  async deleteContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, group: { userId } },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.delete({
      where: { id: contactId },
    });

    return { success: true, message: 'Contact deleted' };
  }

  private formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `91${digits}`;
    }
    if (digits.startsWith('91') && digits.length === 12) {
      return digits;
    }
    if (digits.startsWith('0') && digits.length === 11) {
      return `91${digits.substring(1)}`;
    }
    return digits;
  }
}
