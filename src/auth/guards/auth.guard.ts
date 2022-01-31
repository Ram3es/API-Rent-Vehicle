import { JwtService } from "@nestjs/jwt";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeaderAuth: string = request.headers.authorization;

    const tokenType = authHeaderAuth.split(" ")[0];
    const tokenAccess = authHeaderAuth.split(" ")[1];
    if (!tokenType || !tokenAccess) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
