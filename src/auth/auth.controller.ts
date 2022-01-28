import { CreateUserDto } from "./../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Body, Controller, Param, Post, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { EAuthPath } from "./auth.constants";


@Controller(EAuthPath.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(EAuthPath.SIGN_UP)
  async signUp(@Body() dtoUser: CreateUserDto) {
    return await this.authService.registration(dtoUser);
  }
  @Post(EAuthPath.SIGN_IN)
  async signIn(@Req() req: Request, @Body() dtoUser: CreateUserDto) {
    return this.authService.login(dtoUser, req);
  }
  @Post(EAuthPath.FORGOT)
  async forgotPass(@Body() email: Partial<CreateUserDto>) {
    const token = await this.authService.forgot(email);
    return token;
  }
  @Get(EAuthPath.SIGN_OUT)
  async signOut(@Param("id") id: string) {
    await this.authService.logout(id);
  }
}
