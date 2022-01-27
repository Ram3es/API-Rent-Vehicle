import { UpdateUserDto } from './../user/dto/update-user.dto';
import { ValidationPipes } from './../pipes/validation.pipes';
import { JwtAuthGuard } from "./guards/auth.guard";
import { CreateUserDto } from "./../user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Req,
} from "@nestjs/common";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("registration")
  async signUp(@Body() dtoUser: CreateUserDto) {
     return await this.authService.registration(dtoUser);
  }
  //@UseGuards(JwtAuthGuard)
  @Post("login")
  async signIn(@Req() req: Request, @Body() dtoUser: CreateUserDto) {
    return this.authService.login(dtoUser, req);
  }
  @Post("forgot")
  async forgotPass(@Body() email: Partial<CreateUserDto>) {
    const token = await this.authService.forgot(email);
    return token;
  }
  @Get("logout/:id")
  async signOut(@Param("id") id: string) {
    await this.authService.logout(id);
  }
}
