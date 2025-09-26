import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { EncryptorModule } from 'src/modules/bcrypt/bcrypt.module';

@Module({
  imports: [UsersModule, JwtModule, EncryptorModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
