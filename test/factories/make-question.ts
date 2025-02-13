import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionsMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

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

@Injectable()
export class QuestionFactory {
  constructor(private prismaService: PrismaService) {}

  async makeQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data);

    await this.prismaService.question.create({
      data: PrismaQuestionsMapper.toPersistence(question),
    });

    return question;
  }
}
