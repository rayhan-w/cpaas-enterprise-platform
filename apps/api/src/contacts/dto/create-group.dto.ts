import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Group name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Group code is required' })
  @IsString()
  code: string;
}
