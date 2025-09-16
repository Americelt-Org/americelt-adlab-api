import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { Request, Response } from 'express';
import { SessionGuard } from './guard/session.guard';
import { RegisterAccountDto } from './dto/register-account-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { signInToken, data } = await this.authService.login(loginDto.email, loginDto.password);
    response.cookie('user-session', signInToken, {
      httpOnly: true,
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000,
      path: '/', 
    })
    return {
      ...data
    }
  }

  @Post('register')
  async register(
    @Body() payload: RegisterAccountDto, 
    @Res({ passthrough: true }) response: Response
  ) {

    if(payload.password !== payload.confirmPassword) {
      throw new BadRequestException('Password did not match!')
    }
  
    const signInToken = await this.authService.register(payload)

    response.cookie('user-session', signInToken, {
      httpOnly: true,
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000,
      path: '/', 
    })

    return {
      message: "Account created!"
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

  @Delete('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('user-session', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
    return response.redirect('/login');
  }

}
