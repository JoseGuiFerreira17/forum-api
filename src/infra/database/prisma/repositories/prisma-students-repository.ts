import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentsMapper } from '../mappers/prisma-student-mapper';

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentsMapper.toDomain(student);
  }

  async create(student: Student) {
    const data = PrismaStudentsMapper.toPersistence(student);

    await this.prisma.user.create({
      data,
    });
  }
}
