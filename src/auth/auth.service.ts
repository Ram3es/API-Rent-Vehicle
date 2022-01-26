import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserService } from "./../user/user.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "src/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registration({ email, password }: CreateUserDto) {
    const isUserExist = await this.userService.getUserByEmail(email);
    if (isUserExist) {
      throw new HttpException("User with such email already exist", 401);
    }
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.create({
      email,
      password: hashPassword,
      userKey: salt,
    });
    return {
      token: this.generateToken(user),
    };
  }
  async login(dto: CreateUserDto, req: Request) {
    const user = await this.validateUser(dto);
    const authHeader = req.headers.authorization;
    const tokenAccess = authHeader.split(" ")[0];
    if (tokenAccess) {
      await this.verifyToken(tokenAccess, user.userKey);
    }
    return {
      token: this.generateToken(user),
    };
  }
  async logout(id: string) {
    const userKey = await bcrypt.genSalt(5);
    await this.userService.update(id, { userKey });
  }
  async forgot(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        "User with such email not found",
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private generateToken({ id, email, userKey }: User) {
    const payload = { id, email };
    const secret = process.env.JWT_SECRET_KEY.concat(userKey);
    return this.jwtService.sign(payload, { secret });
  }
  private async validateUser({ email, password }: CreateUserDto) {
    const existUser = await this.userService.getUserByEmail(email);
    const isCorrectPass = await bcrypt.compare(password, existUser.password);
    if (!existUser || !isCorrectPass) {
      throw new UnauthorizedException({
        message: "Incorrect email or password",
      });
    }
    return existUser;
  }
  private async verifyToken(token: string, userKey: string) {
    try {
      const secret = process.env.JWT_SECRET_KEY.concat(userKey);
      await this.jwtService.verify(token, { secret });
    } catch (e) {
      throw new HttpException("Access forbiden", HttpStatus.FORBIDDEN);
    }
  }
}
