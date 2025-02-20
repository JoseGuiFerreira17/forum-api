import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { PrismaAttachmentsMapper } from './prisma-attchment-mapper';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      quetionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      title: raw.title,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map((attachment) =>
        PrismaAttachmentsMapper.toDomain(attachment),
      ),
      content: raw.content,
      authorName: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
