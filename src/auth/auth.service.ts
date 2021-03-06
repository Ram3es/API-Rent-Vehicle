import { generateSalt } from "./../utils/genrateSalt";
import { MailService } from "./../mail/mail.service";
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registration({ email, password }: CreateUserDto) {
    const isUserExist = await this.userService.getUserByEmail(email);
    if (isUserExist) {
      throw new HttpException(
        "User with such email already exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    const userKey = await generateSalt(5);
    const hashPassword = await bcrypt.hash(password, await generateSalt(6));
    const user = await this.userService.create({
      email,
      password: hashPassword,
      userKey,
    });
    return {
      token: this.generateToken(user),
    };
  }
  async login(user: Partial<User>) {
    return {
      token: this.generateToken(user),
    };
  }
  async logout(id: number) {
    const userKey = await bcrypt.genSalt(5);
    await this.userService.update(id, { userKey });
  }
  async forgot({ email }: Partial<CreateUserDto>) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        "User with such email not found",
        HttpStatus.NOT_FOUND,
      );
    }
    const token = this.generateToken(user, "15m");
    await this.mailService.sendMail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${token}`,
    );
    return {
      token,
    };
  }
  async resetPass(id: number, { password }: { [key: string]: string }) {
    const salt = await generateSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    await this.userService.update(id, { password: hashPass });
  }

  private generateToken({ id, email, userKey }: Partial<User>, exp?: string) {
    const payload = { id, email };
    const secret = process.env.JWT_SECRET_KEY.concat(userKey);
    return this.jwtService.sign(payload, { secret, expiresIn: exp || "24h" });
  }
  async validateUser({ email, password }: CreateUserDto) {
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
      throw new HttpException(
        "Access forbiden, token has expired",
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
