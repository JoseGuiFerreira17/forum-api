import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

type PrismaCommentWhithAuthor = PrismaComment & {
  author: PrismaUser;
};

export class PrismaQuestionCommentWhithAuthorMapper {
  static toDomain(raw: PrismaCommentWhithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      content: raw.content,
      authorName: raw.author.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
