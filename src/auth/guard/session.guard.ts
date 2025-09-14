import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userSession = request.cookies["auth-session"];

    if (!userSession) {
      return false;
    }

    const user = this.jwtService.decode(userSession);
    
    if(!user || !user.id || !user.email) {
      return false
    }

    const storedUserDetails = await this.userService.findOne(user.email)

    if(!storedUserDetails){
      return false
    }

    const { password, ...data } = storedUserDetails
    request.authenticatedUser = data

    return true;
  }
}