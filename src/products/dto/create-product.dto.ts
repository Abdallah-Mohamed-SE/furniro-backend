import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'SYL-001', description: 'Unique Stock Keeping Unit' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 'Syltherine', description: 'English name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'سيلثرين', description: 'Arabic name' })
  @IsString()
  @IsNotEmpty()
  nameAr: string;

  @ApiProperty({ example: 'syltherine', description: 'Unique product slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Stylish cafe chair', description: 'English subtitle' })
  @IsString()
  @IsNotEmpty()
  subtitle: string;

  @ApiProperty({ example: 'كرسي مقهى أنيق', description: 'Arabic subtitle' })
  @IsString()
  @IsNotEmpty()
  subtitleAr: string;

  @ApiProperty({ example: 'A sophisticated cafe chair...', description: 'English description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'كرسي مقهى راقٍ...', description: 'Arabic description' })
  @IsString()
  @IsNotEmpty()
  descriptionAr: string;

  @ApiProperty({ example: 2500000, description: 'Price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 3500000, description: 'Original price before discount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ example: 30, description: 'Discount percentage' })
  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: ['/images/products/syltherine-1.jpg'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional({ example: ['Standard', 'Large'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({ example: ['Natural', 'Walnut'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional({ example: ['chair', 'living'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 4.5, default: 4.5 })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  reviewsCount?: number;

  @ApiProperty({ description: 'Category ID foreign key' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
