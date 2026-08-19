import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApiKeyDto {
  @IsNotEmpty({ message: 'Key label/name is required' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  permissions?: string; // Default: 'sms:send,sms:read'
}
