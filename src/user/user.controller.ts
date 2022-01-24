import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from "./dto/crete-user.dto";
import { UserService } from "./user.service";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "./user.entity";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(dto);
    return user;
  }
  @Get()
  async getAllUsers():Promise<User[]>{
      return await this.userService.getAll()
  }
  @Get("/:id")
  async getUser(@Param("id") id: string ): Promise<User>{
      return await this.userService.getOne(id)
  }
  @Put("/:id")
  async updateUser(@Param("id") id: string, @Body() dto: UpdateUserDto):Promise<void> {
       await this.userService.update(id,dto)
  }
  @Delete("/:id")
  async removeUser(@Param("id") id: string){
      return this.userService.delete(id)
  }
}
