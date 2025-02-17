import { Either, left, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { questionComments: QuestionComment[] }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private questionCommentsRespository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRespository.findManyByQuestionId(questionId, {
        page,
      });

    if (!questionComments) {
      return left(new ResourceNotFoundError());
    }

    return right({ questionComments });
  }
}
