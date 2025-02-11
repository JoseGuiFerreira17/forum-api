import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';

export function makeQuestion(
  overrides: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      ...overrides,
    },
    id,
  );

  return question;
}
