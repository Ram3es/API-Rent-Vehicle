import { UserModule } from "./../user/user.module";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      signOptions: {
        expiresIn: "24h",
      },
    }),
    UserModule,
  ],
})
export class AuthModule {}
