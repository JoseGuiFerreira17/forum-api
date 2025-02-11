import { Injectable } from '@nestjs/common'; 

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  async findById(id: string) {
    throw new Error('Method not implemented.');
  }
  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    throw new Error('Method not implemented.');
  }
  async delete(answerComment: AnswerComment) {
    throw new Error('Method not implemented.');
  }
  async create(answerComment: AnswerComment) {
    throw new Error('Method not implemented.');
  }