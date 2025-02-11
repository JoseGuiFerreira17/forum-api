import { Either, left, right } from '@/core/either';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

interface FetchQuetionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuetionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { questionComments: QuestionComment[] }
>;

export class FetchQuetionCommentsUseCase {
  constructor(
    private questionCommentsRespository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuetionCommentsUseCaseRequest): Promise<FetchQuetionCommentsUseCaseResponse> {
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
