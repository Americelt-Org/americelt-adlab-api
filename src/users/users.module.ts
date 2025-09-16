import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptorModule } from 'src/encryptor/encryptor.module';

@Module({
  imports: [DatabaseModule, EncryptorModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
