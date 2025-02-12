import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Student } from '../../enterprise/entities/student';
import { StudentsRepository } from '../repositories/students-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentAlreadyExistsError } from './errors/student-already-existis';

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  { student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRespository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentAlreadyExists =
      await this.studentsRespository.findByEmail(email);

    if (studentAlreadyExists) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.studentsRespository.create(student);

    return right({ student });
  }
}
