import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty({ message: 'Header ID is required' })
  @IsString()
  headerId: string;

  @IsNotEmpty({ message: 'DLT Template ID code is required' })
  @IsString()
  @Length(10, 25, { message: 'DLT Template ID must be between 10 and 25 numeric digits' })
  templateIdCode: string;

  @IsNotEmpty({ message: 'Template name is required' })
  @IsString()
  templateName: string;

  @IsNotEmpty({ message: 'Template type is required' })
  @IsString()
  templateType: string; // PROMOTIONAL, TRANSACTIONAL, SERVICE_IMPLICIT

  @IsNotEmpty({ message: 'Template content is required' })
  @IsString()
  content: string; // E.g. "Dear {#var#}, your OTP is {#var#}. Valid 10m."
}
