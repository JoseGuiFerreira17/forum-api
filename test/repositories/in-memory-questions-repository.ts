import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/paginations-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
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

  async findDetailsBySlug(slug: string) {
    const question = this.items.find(
      (question) => question.slug.value === slug,
    );

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    );

    if (!author) {
      throw new Error('Author not found');
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (attachment) => attachment.questionId.equals(question.id),
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });
      if (!attachment) {
        throw new Error('Attachments not found');
      }
      return attachment;
    });

    return QuestionDetails.create({
      quetionId: question.id,
      title: question.title,
      slug: question.slug,
      content: question.content,
      authorId: question.authorId,
      authorName: author.name,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments,
    });
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
