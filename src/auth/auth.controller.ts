import {
  Controller,
  Post,
  Body,
  // BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeneralSuccess } from '../dto/response/success.dto';
import { LoginRequest } from './dto/auth.dto';
// import { GeneralError } from '../dto/response/error.dto';
import { CustomValidatorPipe } from 'src/validation/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(CustomValidatorPipe)
  async postHello(
    @Body()
    loginData: LoginRequest,
  ): Promise<GeneralSuccess> {
    // if (loginData.password === undefined || loginData.username === undefined) {
    //   const err: GeneralError = {
    //     message: 'request not valid',
    //     detail: 'username and password required',
    //   };
    //   throw new BadRequestException(err);
    // }
    return await this.authService.login(loginData);
  }
}
