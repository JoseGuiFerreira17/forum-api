import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('fetch recent quetion comments use case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryRepository);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    await inMemoryRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    );
    await inMemoryRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    );
    await inMemoryRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
        authorId: student.id,
      }),
    );

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ authorName: 'John Doe' }),
        expect.objectContaining({ authorName: 'John Doe' }),
        expect.objectContaining({ authorName: 'John Doe' }),
      ]),
    );
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
