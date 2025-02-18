import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string) {
    return this.items.find((question) => question.id.toString() === id) || null;
  }

  async delete(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);
    this.items.splice(index, 1);
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }

  async update(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);
    this.items[index] = question;

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    return this.items.find((question) => question.slug.value === slug) || null;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
