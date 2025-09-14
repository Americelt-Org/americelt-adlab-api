import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { Request, Response } from 'express';
import { SessionGuard } from './guard/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {

    const { access_token, data } = await this.authService.login(loginDto.email, loginDto.password);
    
    response.cookie('auth-session', access_token, {
      httpOnly: true, // Prevents client-side JavaScript access
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      path: '/', // Cookie available for entire domain
    })

    return {
      ...data
    }
  }

  @Get('me')
  @UseGuards(SessionGuard)
  async validateSession(
    @Req() request: Request & { authenticatedUser?: any }
  ){
    const user = request.authenticatedUser
    return user
  }

}
