import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save({ ...dto });
    return user;
  }
  async getAll() {
    return await this.usersRepository.find();
  }
  async getOneByID(id: number): Promise<User> {
    return await this.usersRepository.findOne(id);
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }
  async update(id: number, dto: UpdateUserDto): Promise<void> {
    this.usersRepository.update(id, {...dto});
  }
  async delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
