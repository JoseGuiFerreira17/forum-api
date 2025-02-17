import { Either, left, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComments: AnswerComment[] }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRespository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRespository.findManyByAnswerId(answerId, {
        page,
      });

    if (!answerComments) {
      return left(new ResourceNotFoundError());
    }

    return right({ answerComments });
  }
}
