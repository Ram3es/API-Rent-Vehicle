import { UserModule } from "./../user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "src/mail/mail.module";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [JwtModule.register({}), UserModule, MailModule],
})
export class AuthModule {}
