import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/modules/database/database.module';
import { EncryptorModule } from 'src/modules/bcrypt/bcrypt.module';

@Module({
  imports: [DatabaseModule, EncryptorModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
