import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments';

let inMemoryRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttchmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('fetch recent quetions use case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttchmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttchmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await inMemoryRepository.create(
      makeQuestion({ createdAt: new Date(2025, 1, 3) }),
    );
    await inMemoryRepository.create(
      makeQuestion({ createdAt: new Date(2025, 1, 1) }),
    );
    await inMemoryRepository.create(
      makeQuestion({ createdAt: new Date(2025, 0, 29) }),
    );

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 1, 3) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 1) }),
      expect.objectContaining({ createdAt: new Date(2025, 0, 29) }),
    ]);
  });

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });

    expect(result.value?.questions).toHaveLength(2);
  });
});
