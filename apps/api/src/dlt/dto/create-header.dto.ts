import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateHeaderDto {
  @IsNotEmpty({ message: 'Header / Sender ID name is required' })
  @IsString()
  @Length(6, 6, { message: 'Sender ID must be exactly 6 alphanumeric characters' })
  @Matches(/^[A-Z0-9]{6}$/, { message: 'Sender ID must be 6 uppercase alphanumeric characters (e.g. TFISMS)' })
  headerName: string;

  @IsNotEmpty({ message: 'Header type is required' })
  @IsString()
  headerType: string; // PROMOTIONAL, TRANSACTIONAL, SERVICE_IMPLICIT, SERVICE_EXPLICIT
}
