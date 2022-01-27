import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail({},{message:" Incorrect email"})
  @IsString({message:"Must have a string"})
  readonly email: string;
  @Length(4, 18, {message:"Password should be min 4 max 18 characters"})
  @IsString({message:"Must have a string"})
  readonly password: string;
  readonly userKey?: string;
}
