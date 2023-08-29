import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeneralSuccess } from '../dto/response/success.dto';
import { LoginRequest } from './dto/auth.dto';
import { GeneralError } from '../dto/response/error.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async postHello(
    @Body()
    loginData: LoginRequest,
  ): Promise<GeneralSuccess> {
    if (loginData.password === undefined || loginData.username === undefined) {
      const err: GeneralError = {
        message: 'request not valid',
        detail: 'username and password required',
      };
      throw new BadRequestException(err);
    }
    return await this.authService.login(loginData);
  }
}
