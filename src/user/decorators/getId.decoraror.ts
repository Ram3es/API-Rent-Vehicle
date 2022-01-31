import { User } from "src/user/user.entity";

import { Request } from "express";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUserProps = createParamDecorator(
  (value: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: Partial<User> = request.user;
    return user[value];
  },
);
