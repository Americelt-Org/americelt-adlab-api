import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { RegisterAccountDto } from 'src/auth/dto/register-account-dto';
import { EncryptorService } from 'src/encryptor/encryptor.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {

  constructor(
    private databaseService: DatabaseService,
    private encryptorService: EncryptorService
  ){}

  async findOne(email: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { email }
    });
    return user;
  }

  async create(payload: RegisterAccountDto) {
    const hashedPassword = await this.encryptorService.getHashPassword(payload.password)
   
    try {
      return await this.databaseService.user.create({
        data: {
          email: payload.email,
          password: hashedPassword
        }
      })
    }
    catch(e){
      throw new HttpException(`Email already exists!`, HttpStatus.CONFLICT)
    }
  
  }
}
