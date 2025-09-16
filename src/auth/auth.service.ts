import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterAccountDto } from './dto/register-account-dto';
import { ConfigService } from '@nestjs/config';
import { EncryptorService } from 'src/encryptor/encryptor.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private encryptorService: EncryptorService
  ) { }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user || !(await this.encryptorService.isMatch(pass, user.password))) {
      throw new BadRequestException("Invalid login credentials");
    }
    const { password, ...safeUser } = user;
    const signInToken = await this.jwtService.signAsync(safeUser, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    return { user: safeUser, signInToken };
  }

  async register(payload: RegisterAccountDto) {
    const { password, ...userDetails } = await this.usersService.create(payload)
    const signInToken = await this.jwtService.signAsync(userDetails, {
      secret: this.configService.get<string>('JWT_SECRET')
    })
    return signInToken
  }
}
