import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { RequesteStorageService } from 'src/request-storage.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionMiddleware implements NestMiddleware {

  constructor(
    private jwtService: JwtService,
    private requestStorage: RequesteStorageService,
    private readonly userService: UsersService
  ){}

  async use(req: Request, res: Response, next: NextFunction) {
    const userSessionCookie = req.cookies['auth-session']
    
    if(!userSessionCookie){
      return res.status(403).json({
        message: "Forbidden resource",
        error: "Forbidden",
      })
    }

    const { email } = this.jwtService.decode(userSessionCookie)

    const fromDbUser = await this.userService.findOne(email)

    if(!fromDbUser) {
       return res.status(403).json({
        message: "Forbidden resource",
        error: "Forbidden",
      }) 
    }

    this.requestStorage.setUser({ 
      id: fromDbUser.id,
      email: fromDbUser.email
     })
  
    next();
  }
}
