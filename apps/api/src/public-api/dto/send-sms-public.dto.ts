import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendSmsPublicDto {
  @IsNotEmpty({ message: 'Recipient phone number is required (e.g. 919876543210)' })
  @IsString()
  recipient: string;

  @IsNotEmpty({ message: 'sender_id / DLT Header is required (e.g. TFISMS)' })
  @IsString()
  sender_id: string;

  @IsOptional()
  @IsString()
  template_id?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  variables?: string[] | Record<string, string>;
}
