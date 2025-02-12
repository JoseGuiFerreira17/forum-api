import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryRepository: InMemoryStudentsRepository;
let hashGenerator: FakeHasher;
let sut: RegisterStudentUseCase;

describe('register student use case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryStudentsRepository();
    hashGenerator = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryRepository, hashGenerator);
  });

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'student-1',
      email: 'student@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'student-1',
      email: 'student@example.com',
      password: '123456',
    });

    const hashedPassword = await hashGenerator.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryRepository.items[0].password).toEqual(hashedPassword);
  });
});
