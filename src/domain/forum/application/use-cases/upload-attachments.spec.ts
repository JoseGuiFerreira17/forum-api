import { UploadAttachmentsUseCase } from './upload-attachments';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';

let inMemoryRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAttachmentsUseCase;

describe('upload attachment use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAttachmentsUseCase(inMemoryRepository, fakeUploader);
  });

  it('should be able to upload an attachment', async () => {
    const result = await sut.execute({
      fileName: 'image.jpeg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'image.jpeg',
        url: expect.any(String),
      }),
    );
  });

  it('should not be able to upload an attachment with ivalid file type', async () => {
    const result = await sut.execute({
      fileName: 'File.txt',
      fileType: 'text/plain',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
