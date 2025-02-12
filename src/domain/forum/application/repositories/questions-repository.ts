import { PaginationParams } from '@/core/repositories/paginations-params';
import { Question } from '../../enterprise/entities/question';

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract delete(question: Question): Promise<void>;
  abstract update(question: Question): Promise<void>;
  abstract create(question: Question): Promise<void>;
}
