import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment';

export function makeQuestionAttachment(
  overrides: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...overrides,
    },
    id,
  );

  return questionAttachment;
}
