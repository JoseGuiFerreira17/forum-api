import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionsMapper } from '../mappers/prisma-question-mapper';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

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

  async findManyRecent({ page }: PaginationParams) {
    throw new Error('Method not implemented.');
  }
  async delete(question: Question) {
    throw new Error('Method not implemented.');
  }
  async update(question: Question) {
    throw new Error('Method not implemented.');
  }
  async create(question: Question) {
    throw new Error('Method not implemented.');
  }
}
