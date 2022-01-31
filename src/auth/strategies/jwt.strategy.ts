import { UserService } from "../../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (
        request: Request,
        rawJwtToken: string,
        done: (err: any, secret: string) => void,
      ) => {
        const { id }: { [key: string]: number } = this.jwtService.decode(
          rawJwtToken,
        ) as { id: number };
        const user = await this.userService.getOneByID(id);
        const JWT_SECRET_KEY = this.config.get<string>("JWT_SECRET_KEY");
        done(null, `${JWT_SECRET_KEY}${user.userKey}`);
      },
    });
  }
  async validate(payload: any) {
    return await this.userService.getOneByID(payload.id);
  }
}
