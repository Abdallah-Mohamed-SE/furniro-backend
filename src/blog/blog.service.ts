import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogQueryDto } from './dto/blog-query.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: BlogQueryDto) {
    const { category, search, page = 1, limit = 9 } = query;

    const where: Prisma.BlogPostWhereInput = {};

    if (category) {
      where.OR = [
        { category: { equals: category, mode: 'insensitive' } },
        { categoryAr: { equals: category, mode: 'insensitive' } },
      ];
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { titleAr: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { excerptAr: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { contentAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug '${slug}' not found`);
    }

    return post;
  }

  async create(dto: CreateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Blog post with slug '${dto.slug}' already exists`);
    }

    return this.prisma.blogPost.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID '${id}' not found`);
    }

    if (dto.slug && dto.slug !== post.slug) {
      const existing = await this.prisma.blogPost.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Blog post with slug '${dto.slug}' already exists`);
      }
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Blog post with ID '${id}' not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
