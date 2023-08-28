import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, User } from '@prisma/client';
import { GeneralError } from './dto/response/error.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  my(): string {
    return 'this is your user';
  }

  async signUp(data: Prisma.UserCreateInput): Promise<User> {
    let userData: User;
    try {
      userData = await this.prisma.user.create({ data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const err: GeneralError = {
            message: 'username or email already existst',
            detail: e.message,
          };
          throw new BadRequestException(err);
        }
        throw new BadRequestException(e.message);
      }
      throw new InternalServerErrorException(e);
    }
    return userData;
  }
}
