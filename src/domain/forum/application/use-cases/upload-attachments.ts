import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';

interface UploadAttachmentsUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAttachmentsUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>;

@Injectable()
export class UploadAttachmentsUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentsUseCaseRequest): Promise<UploadAttachmentsUseCaseResponse> {
    if (!/^(image\/jpeg|image\/png|application\/pdf)$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url: url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
