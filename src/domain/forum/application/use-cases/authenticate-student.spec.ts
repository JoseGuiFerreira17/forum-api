import { FakeHasher } from 'test/cryptography/fake-hasher';
import { AuthenticateStudentUseCase } from './authenticate-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeStudent } from 'test/factories/make-student';
import { WrongCredentialsError } from './errors/wrong-credentials';

let inMemoryRepository: InMemoryStudentsRepository;
let hashGenerator: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe('authenticate student use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryStudentsRepository();
    hashGenerator = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      inMemoryRepository,
      hashGenerator,
      encrypter,
    );
  });

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'student@example.com',
      password: await hashGenerator.hash('123456'),
    });

    inMemoryRepository.items.push(student);

    const result = await sut.execute({
      email: 'student@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate a student with invalid credentials', async () => {
    const student = makeStudent({
      email: 'student@example.com',
      password: await hashGenerator.hash('123456'),
    });

    inMemoryRepository.items.push(student);

    const result = await sut.execute({
      email: 'student@example.com',
      password: '1234567',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
