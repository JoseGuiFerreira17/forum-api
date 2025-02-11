import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';

export function makeAnswerAttachment(
  overrides: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...overrides,
    },
    id,
  );

  return answerAttachment;
}
