import { PaginationParams } from '@/core/repositories/paginations-params';
import { Question } from '../../enterprise/entities/question';

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  delete(question: Question): Promise<void>;
  update(question: Question): Promise<void>;
  create(question: Question): Promise<void>;
}
