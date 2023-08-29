import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GeneralSuccess } from 'src/dto/response/success.dto';
import { PrismaService } from 'src/prisma.service';
import { LoginRequest } from 'src/auth/dto/request.dto';
import { GeneralError } from 'src/dto/response/error.dto';
import { PasswordService } from 'src/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(loginData: LoginRequest): Promise<GeneralSuccess> {
    const userData = await this.prisma.user.findFirst({
      where: {
        username: loginData.username,
      },
      select: {
        username: true,
        password: true,
        name: true,
      },
    });

    if (!userData) {
      const err: GeneralError = {
        message: 'cannot login',
        detail: 'user not found',
      };
      throw new NotFoundException(err);
    }

    if (
      !(await this.passwordService.comparePassword(
        loginData.password,
        userData.password,
      ))
    ) {
      const err: GeneralError = {
        message: 'cannot login',
        detail: "password doesn't match",
      };
      throw new UnauthorizedException(err);
    }

    const res: GeneralSuccess = {
      message: 'successfully logged in',
      detail: null,
    };
    return res;
  }
}
