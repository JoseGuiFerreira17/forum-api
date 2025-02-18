import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((answer) => answer.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async findById(id: string) {
    return this.items.find((answer) => answer.id.toString() === id) || null;
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id);
    this.items.splice(index, 1);
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }

  async update(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id);
    this.items[index] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
