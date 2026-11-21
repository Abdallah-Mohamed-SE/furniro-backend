import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BlogQueryDto {
  @ApiPropertyOptional({ description: 'Filter by blog category name' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search term for title or content (Arabic or English)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 1))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 9 })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : 9))
  @IsInt()
  @Min(1)
  limit?: number = 9;
}
