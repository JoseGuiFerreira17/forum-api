import { Injectable } from '@nestjs/common';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { PrismaService } from '../prisma.service';
import { PrismaAnswersMapper } from '../mappers/prisma-answer-mapper';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswersMapper.toDomain(answer);
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map((answer) => PrismaAnswersMapper.toDomain(answer));
  }

  async delete(answer: Answer) {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }

  async update(answer: Answer) {
    const data = PrismaAnswersMapper.toPersistence(answer);

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);
  }

  async create(answer: Answer) {
    const data = PrismaAnswersMapper.toPersistence(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );
  }
}
