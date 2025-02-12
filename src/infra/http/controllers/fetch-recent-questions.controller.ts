import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidation = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidation) page: PageQueryParamSchema) {
    const result = await this.fetchRecentQuestions.execute({ page });

    if (result.isLeft()) {
      throw new Error();
    }

    const questions = result.value.questions;

    return { questions: questions.map((q) => QuestionPresenter.toHTTP(q)) };
  }
}
