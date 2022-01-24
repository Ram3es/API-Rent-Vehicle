import { CreateUserDto } from "./dto/crete-user.dto";
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
  async create(dto: CreateUserDto): Promise<User>{
    const user = await this.usersRepository.save({ ...dto });
    return user;
  }
  async getAll(){
    return await this.usersRepository.find()
  }
  async getOne(id: string): Promise<User>{
    return await this.usersRepository.findOne(id)
  }
  async update(id: string, dto: UpdateUserDto){
    return this.usersRepository.update(id,{...dto})
  }
  async delete(id: string){
    return this.usersRepository.delete(id)
  }
}
