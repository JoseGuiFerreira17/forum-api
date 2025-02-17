import { BadRequestException, Delete, Param } from '@nestjs/common';
import { Controller, HttpCode } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt_strategy';

import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const result = await this.deleteAnswerComment.execute({
      authorId: user.sub,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
