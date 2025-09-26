import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email cannot be empty!' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'password cannot be empty!' })
  password: string
}