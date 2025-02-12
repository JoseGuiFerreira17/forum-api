import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
    private jwt: JwtService,
  ) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(authenticateBodySchema))
    body: AuthenticateBodySchema,
  ) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
