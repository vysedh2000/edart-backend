import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { userLoginDto, userSignUpDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { SessionGuard } from '../common/guard/session.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async userLogin(@Body() request: userLoginDto): Promise<any> {
    return this.authService.login(request);
  }

  @Post('signup')
  async userSignUp(@Body() request: userSignUpDto): Promise<any> {
    return this.authService.signup(request);
  }

  @Get('me')
  @UseGuards(SessionGuard)
  async getUser(@Req() request: Request) {
    const token = request.cookies?.['authid'];
    return this.authService.getUser(token);
  }
}
