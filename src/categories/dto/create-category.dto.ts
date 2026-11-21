import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Dining', description: 'Category English name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'غرفة الطعام', description: 'Category Arabic name' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({ example: 'dining', description: 'Category unique slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: '/images/categories/dining.jpg', description: 'Category thumbnail image' })
  @IsOptional()
  @IsString()
  image?: string;
}
