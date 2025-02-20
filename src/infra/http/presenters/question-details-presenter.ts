import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { AttachmentPresenter } from './attachment-presenter';

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      quetionId: questionDetails.quetionId.toString(),
      title: questionDetails.title,
      slug: questionDetails.slug,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachemnts: questionDetails.attachments.map((attachment) => {
        return AttachmentPresenter.toHTTP(attachment);
      }),
      authorId: questionDetails.authorId.toString(),
      authorName: questionDetails.authorName,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    };
  }
}
