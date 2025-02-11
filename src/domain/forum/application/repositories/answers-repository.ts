import { PaginationParams } from '@/core/repositories/paginations-params';
import { Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  delete(question: Answer): Promise<void>;
  update(question: Answer): Promise<void>;
  create(answer: Answer): Promise<void>;
}
