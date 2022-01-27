import { PartialType } from "@nestjs/mapped-types";
import { IsString, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: "Should be a string type" })
  @MinLength(2, { message: "Should be min 2 characters" })
  readonly firstName?: string;
  @IsString({ message: "Should be a string type" })
  @MinLength(2, { message: "Should be min 2 characters" })
  readonly lastName?: string;
}
