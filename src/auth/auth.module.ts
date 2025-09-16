import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { EncryptorModule } from 'src/encryptor/encryptor.module';

@Module({
  imports: [UsersModule, JwtModule, EncryptorModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
