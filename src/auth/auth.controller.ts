import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CreateUserDto } from "./../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Body, Controller, Post, Get, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { EAuthPath } from "./auth.constants";
import { LocalAuthGuard } from "./guards/local.guard";
import { User } from "src/user/user.entity";

@Controller(EAuthPath.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post(EAuthPath.SIGN_UP)
  async signUp(@Body() dtoUser: CreateUserDto) {
    return await this.authService.registration(dtoUser);
  }
  @UseGuards(LocalAuthGuard)
  @Post(EAuthPath.SIGN_IN)
  async signIn(@Req() req: Request) {
    const user: Partial<User> = req.user;
    return this.authService.login(user);
  }
  @Post(EAuthPath.FORGOT)
  async forgotPass(@Body() email: Partial<CreateUserDto>) {
    const token = await this.authService.forgot(email);
    return token;
  }
  @UseGuards(JwtAuthGuard)
  @Get(EAuthPath.SIGN_OUT)
  async signOut(@Req() req: Request) {
    const { id }: Partial<User> = req.user;
    await this.authService.logout(id);
  }
}
