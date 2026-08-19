import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { BulkContactsDto } from './dto/bulk-contacts.dto';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Groups
  @Get('groups')
  async getGroups(@CurrentUser('id') userId: string) {
    return this.contactsService.getGroups(userId);
  }

  @Post('groups')
  async createGroup(@CurrentUser('id') userId: string, @Body() dto: CreateGroupDto) {
    return this.contactsService.createGroup(userId, dto);
  }

  @Delete('groups/:id')
  async deleteGroup(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contactsService.deleteGroup(userId, id);
  }

  // Contacts
  @Get('groups/:groupId/items')
  async getContactsByGroup(
    @CurrentUser('id') userId: string,
    @Param('groupId') groupId: string,
    @Query('search') search?: string,
  ) {
    return this.contactsService.getContactsByGroup(userId, groupId, search);
  }

  @Post('items')
  async createContact(@CurrentUser('id') userId: string, @Body() dto: CreateContactDto) {
    return this.contactsService.createContact(userId, dto);
  }

  @Post('bulk-import')
  async bulkImport(@CurrentUser('id') userId: string, @Body() dto: BulkContactsDto) {
    return this.contactsService.bulkImportContacts(userId, dto);
  }

  @Delete('items/:id')
  async deleteContact(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.contactsService.deleteContact(userId, id);
  }
}
