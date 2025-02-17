import { Either, left, right } from '@/core/either';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { Injectable } from '@nestjs/common';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right(null);
  }
}
