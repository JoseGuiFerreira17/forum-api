import { Prisma } from '@prisma/client';

import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class PrismaAttachmentsMapper {
  static toPersistence(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
