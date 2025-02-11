import { PaginationParams } from '@/core/repositories/paginations-params';
import { AnswerComment } from '../../enterprise/entities/answer-comment';

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>;
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  delete(answerComment: AnswerComment): Promise<void>;
  create(answerComment: AnswerComment): Promise<void>;
}
