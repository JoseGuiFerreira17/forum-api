import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuetionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuetionCommentsUseCase;

describe('fetch recent quetion comments use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionCommentsRepository();
    sut = new FetchQuetionCommentsUseCase(inMemoryRepository);
  });

  it('should be able to fetch question comments', async () => {
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );
    await inMemoryRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
