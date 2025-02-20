import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { Slug } from './slug';
import { Attachment } from '../attachment';

export interface QuestionDetailsProps {
  quetionId: UniqueEntityId;
  title: string;
  slug: Slug;
  content: string;
  attachments: Attachment[];
  bestAnswerId?: UniqueEntityId | null;
  authorId: UniqueEntityId;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get quetionId() {
    return this.props.quetionId;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  get attachments() {
    return this.props.attachments;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get authorName() {
    return this.props.authorName;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }
}
