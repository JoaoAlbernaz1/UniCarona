import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType, Prisma } from '../../generated/prisma/client';

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface ListNotificationsInput {
  page: number;
  limit: number;
  read?: boolean;
  type?: NotificationType;
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateNotificationInput, client: Prisma.TransactionClient = this.prisma) {
    return client.notification.create({ data: input });
  }

  createMany(inputs: CreateNotificationInput[], client: Prisma.TransactionClient = this.prisma) {
    if (!inputs.length) return Promise.resolve({ count: 0 });
    return client.notification.createMany({ data: inputs });
  }

  async list(userId: string, input: ListNotificationsInput) {
    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(input.read === undefined ? {} : { readAt: input.read ? { not: null } : null }),
      ...(input.type ? { type: input.type } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      this.prisma.notification.count({ where }),
    ]);
    return { items, page: input.page, limit: input.limit, total };
  }

  async markAsRead(userId: string, id: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
    if (!result.count) throw new NotFoundException('Notificação não encontrada.');
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { updated: result.count };
  }

  async unreadCount(userId: string) {
    return { count: await this.prisma.notification.count({ where: { userId, readAt: null } }) };
  }
}
