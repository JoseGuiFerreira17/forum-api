import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt_strategy';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();

    return request.user as UserPayload;
  },
);
