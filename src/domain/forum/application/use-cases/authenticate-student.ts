import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { StudentsRepository } from '../repositories/students-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRespository: StudentsRepository,
    private HashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRespository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const passwordMatch = await this.HashComparer.compare(
      password,
      student.password,
    );

    if (!passwordMatch) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
