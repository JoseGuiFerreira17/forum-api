import { Delete, Param } from '@nestjs/common';
import { Controller, HttpCode } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt_strategy';

import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    await this.deleteQuestion.execute({
      authorId: user.sub,
      questionId,
    });
  }
}
