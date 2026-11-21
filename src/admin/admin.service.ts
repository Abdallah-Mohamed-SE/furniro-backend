import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      revenueResult,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
      unreadMessages,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          status: {
            not: OrderStatus.CANCELLED,
          },
        },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({
        where: {
          status: OrderStatus.PENDING,
        },
      }),
      this.prisma.product.count(),
      this.prisma.product.count({
        where: {
          stock: {
            lt: 5,
          },
        },
      }),
      this.prisma.user.count(),
      this.prisma.contactMessage.count({
        where: {
          isRead: false,
        },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      totalRevenue: revenueResult._sum.total ?? 0,
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
      unreadMessages,
      recentOrders,
    };
  }
}
