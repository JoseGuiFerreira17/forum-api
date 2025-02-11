import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { ReadNotificationUseCase } from './read-notification';
import { makeNotification } from 'test/factories/make-notification';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed';

let inMemoryRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('send notification use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryRepository);
  });

  it('should be able read a notification', async () => {
    const notification = makeNotification();

    await inMemoryRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able read a notification from another user', async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    });

    inMemoryRepository.create(newNotification);

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: newNotification.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
