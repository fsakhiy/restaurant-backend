import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.my();
  }

  @Post('signup')
  async createUser(
    @Body()
    postData: {
      name: string;
      username: string;
      password: string;
      email: string;
    },
  ): Promise<UserModel> {
    return await this.userService.signUp(postData);
  }
}
