import { Either, left, right } from '@/core/either';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRespository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRespository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    if (!comments) {
      return left(new ResourceNotFoundError());
    }

    return right({ comments });
  }
}
