import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaStudentsMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper';

export function makeStudent(
  overrides: Partial<StudentProps> = {},
  id?: UniqueEntityId,
) {
  const student = Student.create(
    {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrides,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data);

    await this.prismaService.user.create({
      data: PrismaStudentsMapper.toPersistence(student),
    });

    return student;
  }
}
