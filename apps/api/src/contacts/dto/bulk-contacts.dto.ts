import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BulkContactItem {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  customVars?: Record<string, any> | string;
}

export class BulkContactsDto {
  @IsNotEmpty({ message: 'Group ID is required' })
  @IsString()
  groupId: string;

  @IsArray()
  contacts: BulkContactItem[];
}
