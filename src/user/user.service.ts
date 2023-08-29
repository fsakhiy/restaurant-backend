import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { GeneralError } from '../dto/response/error.dto';
import { deleteUser } from './dto/user.dto';
import { PasswordService } from '../password.service';
import {
  GeneralSuccess,
  SuccessCreatingUser,
} from '../dto/response/success.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async signUp(
    signupData: Prisma.UserCreateInput,
  ): Promise<SuccessCreatingUser> {
    let userData: SuccessCreatingUser;
    const hashedPass = await this.passwordService.hashPassword(
      signupData.password,
    );

    try {
      userData = await this.prisma.user.create({
        data: {
          username: signupData.username,
          name: signupData.name,
          email: signupData.email,
          password: hashedPass,
        },
        select: {
          username: true,
          name: true,
          email: true,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const err: GeneralError = {
            message: 'cannot create user',
            detail: 'username or password already exists',
          };
          throw new BadRequestException(err);
        }
        const err: GeneralError = {
          message: 'cannot create user',
          detail: e.message,
        };
        throw new BadRequestException(err);
      }
      const err: GeneralError = {
        message: 'cannot create user',
        detail: e,
      };
      throw new InternalServerErrorException(err);
    }
    return userData;
  }

  async deleteUser(userData: deleteUser): Promise<GeneralSuccess> {
    const hashedPassword = await this.prisma.user.findFirst({
      where: {
        username: userData.username,
      },
      select: {
        password: true,
      },
    });
    if (!hashedPassword) {
      const err: GeneralError = {
        message: 'cannot delete data',
        detail: 'user not found',
      };
      throw new NotFoundException(err);
    }
    if (
      !(await this.passwordService.comparePassword(
        userData.password,
        hashedPassword.password,
      ))
    ) {
      const err: GeneralError = {
        message: 'cannot delete data',
        detail: "password doesn't match",
      };
      throw new UnauthorizedException(err);
    }

    try {
      await this.prisma.user.delete({
        where: {
          username: userData.username,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const err: GeneralError = {
          message: 'cannot delete data',
          detail: e.message,
        };
        throw new InternalServerErrorException(err);
      }
      const err: GeneralError = {
        message: 'cannot delete data',
        detail: e,
      };
      throw new InternalServerErrorException(err);
    }

    const msg: GeneralSuccess = {
      message: 'success deleting user',
      detail: null,
    };
    return msg;
  }
}
