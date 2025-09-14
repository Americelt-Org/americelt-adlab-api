import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { $ZodUndefined } from 'zod/v4/core/schemas.cjs';

@Injectable()
export class UsersService {

  constructor(
    private databaseService: DatabaseService
  ){}

  async findOne(email: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { email }
    });
    return user;
  }
}
