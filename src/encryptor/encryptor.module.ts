import { Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';

@Module({
  providers: [EncryptorService],
  exports: [EncryptorService]
})
export class EncryptorModule {}
