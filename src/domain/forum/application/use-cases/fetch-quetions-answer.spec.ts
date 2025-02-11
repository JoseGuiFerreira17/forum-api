import { makeAnswer } from 'test/factories/make-answer';
import { FetchQuetionsAnswerUseCase } from './fetch-quetions-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';

let inMemoryRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuetionsAnswerUseCase;

describe('fetch quetions answer use case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new FetchQuetionsAnswerUseCase(inMemoryRepository);
  });

  it('should be able to fetch  questions answer', async () => {
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-1') }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated questions answer', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-1') }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
