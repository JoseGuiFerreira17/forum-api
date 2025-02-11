import { PaginationParams } from '@/core/repositories/paginations-params';
import { Notification } from '../../enterprise/entities/notification';

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>;
  create(notification: Notification): Promise<void>;
  update(notification: Notification): Promise<void>;
}
