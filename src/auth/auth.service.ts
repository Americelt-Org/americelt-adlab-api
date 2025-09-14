import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new BadRequestException("Invalid login credentials");
    }
    const { password, ...data } = user;

    const access_token = await this.jwtService.signAsync(data, {
      secret: "test-1234"
    });

    return {
      data,
      access_token
    }
  }
}
