import { LocalStrategy } from "./strategies/local.strategy";
import { UserModule } from "./../user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.register({}),
    UserModule,
    MailModule,
    PassportModule,
    ConfigModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
