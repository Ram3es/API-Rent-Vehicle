import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { User } from "./user.entity";
import { EUserPath } from "./user.constants";
import { Public } from "src/auth/decorators/public.decorator";
import { GetUserProps } from "./decorators/getId.decoraror";
@UseGuards(JwtAuthGuard)
@Controller(EUserPath.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(dto);
    return user;
  }
  @Public()
  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAll();
  }
  @Get(EUserPath.USER)
  async getUser(@GetUserProps("id") id: number): Promise<User> {
    return await this.userService.getOneByID(id);
  }
  @Put("/:id")
  async updateUser(
    @Param("id") id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.update(id, dto);
  }
  @Delete("/:id")
  async removeUser(@Param("id") id: string) {
    return this.userService.delete(id);
  }
}
