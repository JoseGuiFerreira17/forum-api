import { QuestionsRepository } from '../repositories/questions-repository';
import { Question } from '../../enterprise/entities/question';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  ResourceNotFoundError,
  { questions: Question[] }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRespository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRespository.findManyRecent({ page });

    if (!questions) {
      return left(new ResourceNotFoundError());
    }

    return right({ questions });
  }
}
