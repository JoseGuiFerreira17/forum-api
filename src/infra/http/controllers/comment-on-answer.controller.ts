import { BadRequestException, Body, Param } from '@nestjs/common';
import { Controller, HttpCode, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt_strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const commentOnAnswerBodySchema = z.object({
  content: z.string().min(3),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
