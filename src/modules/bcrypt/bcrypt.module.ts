import { Module } from '@nestjs/common';
import { EncryptorService } from './bcrypt.service';

@Module({
  providers: [EncryptorService],
  exports: [EncryptorService]
})
export class EncryptorModule {}
