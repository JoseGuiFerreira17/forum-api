import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionsMapper } from '../mappers/prisma-question-mapper';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionsMapper.toDomain(question);
  }

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionsMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionDetailsMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map((question) =>
      PrismaQuestionsMapper.toDomain(question),
    );
  }

  async delete(question: Question) {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async update(question: Question) {
    const data = PrismaQuestionsMapper.toPersistence(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ]);
  }
  async create(question: Question) {
    const data = PrismaQuestionsMapper.toPersistence(question);

    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    );
  }
}
