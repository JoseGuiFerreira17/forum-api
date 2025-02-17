import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchQuetionsAnswerUseCase } from '@/domain/forum/application/use-cases/fetch-quetions-answer';
import { AnswerPresenter } from '../presenters/answer-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidation = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswerController {
  constructor(private fetchQuestionAnswers: FetchQuetionsAnswerUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidation) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return {
      answers: answers.map((answer) => AnswerPresenter.toHTTP(answer)),
    };
  }
}
