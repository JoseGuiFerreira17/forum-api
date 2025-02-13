import { Body, Param, Put } from '@nestjs/common';
import { Controller, HttpCode } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt_strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body;

    await this.editQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: [],
      questionId,
    });
  }
}
