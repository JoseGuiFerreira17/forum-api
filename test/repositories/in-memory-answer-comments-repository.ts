import { PaginationParams } from '@/core/repositories/paginations-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((answer) => answer.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async delete(answerComment: AnswerComment) {
    const index = this.items.findIndex((item) => item.id === answerComment.id);
    this.items.splice(index, 1);
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }
}
