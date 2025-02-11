import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';

interface FetchQuetionsAnswerUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuetionsAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  { answers: Answer[] }
>;

export class FetchQuetionsAnswerUseCase {
  constructor(private answerRespository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuetionsAnswerUseCaseRequest): Promise<FetchQuetionsAnswerUseCaseResponse> {
    const answers = await this.answerRespository.findManyByQuestionId(
      questionId,
      { page },
    );

    if (!answers) {
      return left(new ResourceNotFoundError());
    }

    return right({ answers });
  }
}
