import { Optional } from '@/core/entities/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentList } from './answer-attachment-list';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { AnswerCreatedEvent } from '../events/answer-created-event';

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  attachments: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get attachments() {
    return this.props.attachments;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.props.content.slice(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
