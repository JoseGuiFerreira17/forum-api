import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  async findById(id: string) {
    throw new Error('Method not implemented.');
  }
  async findBySlug(slug: string) {
    throw new Error('Method not implemented.');
  }
  async findManyRecent(params: PaginationParams) {
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
