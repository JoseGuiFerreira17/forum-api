import { PaginationParams } from '@/core/repositories/paginations-params';
import { Answer } from '../../enterprise/entities/answer';

export abstract class AnswersRepository {
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  abstract delete(question: Answer): Promise<void>;
  abstract update(question: Answer): Promise<void>;
  abstract create(answer: Answer): Promise<void>;
}
