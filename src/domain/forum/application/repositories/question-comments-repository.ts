import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionComment } from '../../enterprise/entities/question-comment';

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
  delete(questionComment: QuestionComment): Promise<void>;
  create(questionComment: QuestionComment): Promise<void>;
}
