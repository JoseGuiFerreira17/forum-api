import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((question) => question.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async delete(questionComment: QuestionComment) {
    const index = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );
    this.items.splice(index, 1);
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }
}
