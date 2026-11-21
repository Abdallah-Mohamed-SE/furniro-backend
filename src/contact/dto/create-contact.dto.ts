import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Sara Ahmed', description: 'Sender full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sara@example.com', description: 'Sender email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: 'Inquiry about dining table', description: 'Message subject' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ example: 'Hello, I would like to inquire about customized sizes.', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
