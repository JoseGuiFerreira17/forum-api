import { Injectable } from '@nestjs/common';

import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  async findManyByAnswerId(answerId: string) {
    throw new Error('Method not implemented.');
  }
  async deleteManyByAnswerId(answerId: string) {
    throw new Error('Method not implemented.');
  }
}
