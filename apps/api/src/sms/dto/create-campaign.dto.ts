import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CampaignRecipient {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  variables?: string[] | Record<string, string>;
}

export class CreateCampaignDto {
  @IsNotEmpty({ message: 'Campaign name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Sender ID / DLT Header ID is required' })
  @IsString()
  senderId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsNotEmpty({ message: 'Message type is required' })
  @IsString()
  messageType: string; // SEND_NOW, CSV_UPLOAD, GROUP_BROADCAST, SCHEDULED

  @IsOptional()
  @IsString()
  customMessage?: string; // If not strictly bound to DLT template

  @IsOptional()
  @IsString()
  groupId?: string; // If sending to a group

  @IsOptional()
  @IsArray()
  recipients?: CampaignRecipient[];

  @IsOptional()
  @IsString()
  scheduledAt?: string;
}
