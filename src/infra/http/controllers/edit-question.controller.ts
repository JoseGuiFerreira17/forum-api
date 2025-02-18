import { BadRequestException, Body, Param, Put } from '@nestjs/common';
import { Controller, HttpCode } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt_strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const editQuestionBodySchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  attachments: z.array(z.string().uuid()),
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
    const { title, content, attachments } = body;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
