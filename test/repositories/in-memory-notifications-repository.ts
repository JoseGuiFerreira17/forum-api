import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }
  async update(notification: Notification) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === notification.id.toString(),
    );
    this.items[index] = notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }
}
