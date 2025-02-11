import { Injectable } from '@nestjs/common';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  async findById(id: string) {
    throw new Error('Method not implemented.');
  }
  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    throw new Error('Method not implemented.');
  }
  async delete(question: Answer) {
    throw new Error('Method not implemented.');
  }
  async update(question: Answer) {
    throw new Error('Method not implemented.');
  }
  async create(answer: Answer) {
    throw new Error('Method not implemented.');
  }
}
