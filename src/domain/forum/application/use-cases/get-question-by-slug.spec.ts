import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachments';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttchmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('get question by slug use case', () => {
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
    sut = new GetQuestionBySlugUseCase(inMemoryRepository);
  });

  it('should be able create a question', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    const newQuestion = makeQuestion({
      slug: Slug.create('question-title'),
      authorId: student.id,
    });

    await inMemoryRepository.create(newQuestion);

    const attachment = makeAttachment({ title: 'attachment-title' });

    await inMemoryAttchmentsRepository.create(attachment);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    );

    const result = await sut.execute({
      slug: 'question-title',
    });

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        authorName: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'attachment-title',
          }),
        ],
      }),
    });
  });
});
