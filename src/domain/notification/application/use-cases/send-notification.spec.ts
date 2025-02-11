import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let inMemoryRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('send notification use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryRepository);
  });

  it('should be able send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'notification title',
      content: 'notification content',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRepository.items[0]).toEqual(result.value?.notification);
  });
});
