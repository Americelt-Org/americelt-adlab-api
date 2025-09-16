import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptorService {
  async getHashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  async isMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

}
