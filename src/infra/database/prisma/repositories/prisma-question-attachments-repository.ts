import { Injectable } from '@nestjs/common';

import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  async findManyByQuestionId(questionId: string) {
    throw new Error('Method not implemented.');
  }
  async deleteManyByQuestionId(questionId: string) {
    throw new Error('Method not implemented.');
  }
}
