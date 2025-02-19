import { Either, left, right } from '@/core/either';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  { comments: CommentWithAuthor[] }
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
    const comments =
      await this.questionCommentsRespository.findManyByQuestionIdWithAuthor(
        questionId,
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
