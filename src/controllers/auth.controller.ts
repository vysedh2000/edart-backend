import { Body, Controller, Get, Post } from '@nestjs/common';
import { userLoginDto, userSignUpDto } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { decodeHex } from '@oslojs/encoding';

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

  @Post('test')
  async testCon(@Body() request: any): Promise<any> {
    const key = 'my-secret-key';
    return decodeHex(request.test);
  }
}
