import { Either, left, right } from '@/core/either';
import { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/not-allowed';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  attachmentsIds: string[];
  content: string;
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>;
export class EditAnswerUseCase {
  constructor(
    private answersRespository: AnswersRepository,
    private answerAttachmentsRespository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    attachmentsIds,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRespository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRespository.findManyByAnswerId(answerId);

    const answerAttachmentsList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(id),
        answerId: answer.id,
      });
    });

    answerAttachmentsList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentsList;

    await this.answersRespository.update(answer);

    return right({ answer });
  }
}
