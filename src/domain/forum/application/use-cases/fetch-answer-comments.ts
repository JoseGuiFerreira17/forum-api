import { Either, left, right } from '@/core/either';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

interface FetchQuetionCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchQuetionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { answerComments: AnswerComment[] }
>;

export class FetchQuetionCommentsUseCase {
  constructor(private answerCommentsRespository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchQuetionCommentsUseCaseRequest): Promise<FetchQuetionCommentsUseCaseResponse> {
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
