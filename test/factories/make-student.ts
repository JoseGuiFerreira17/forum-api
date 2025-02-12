import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student';

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
