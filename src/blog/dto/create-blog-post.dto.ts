import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: '7 Tips for a Minimal Space', description: 'Blog English title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '7 نصائح لمساحة بسيطة', description: 'Blog Arabic title' })
  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @ApiProperty({ example: '7-tips-for-minimal-space', description: 'Unique slug' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Discover how to create a serene environment...' })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiProperty({ example: 'اكتشف كيف تخلق بيئة هادئة...' })
  @IsString()
  @IsNotEmpty()
  excerptAr: string;

  @ApiProperty({ example: 'Full English article content...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'محتوى المقال الكامل بالعربية...' })
  @IsString()
  @IsNotEmpty()
  contentAr: string;

  @ApiProperty({ example: '/images/blog/minimal-space.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Design Tips' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 'نصائح التصميم' })
  @IsString()
  @IsNotEmpty()
  categoryAr: string;

  @ApiPropertyOptional({ example: 'Admin', default: 'Admin' })
  @IsOptional()
  @IsString()
  author?: string;
}
