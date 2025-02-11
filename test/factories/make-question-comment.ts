import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';

export function makeQuestionComment(
  overrides: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...overrides,
    },
    id,
  );

  return questionComment;
}
