import { PaginationParams } from '@/core/repositories/paginations-params';
import { AnswerComment } from '../../enterprise/entities/answer-comment';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
  abstract create(answerComment: AnswerComment): Promise<void>;
}
