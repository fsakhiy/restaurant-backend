import {
  Body,
  Controller,
  Post,
  Delete,
  BadRequestException,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  GeneralSuccess,
  SuccessCreatingUser,
} from 'src/dto/response/success.dto';
import { DeleteUser, RegisterUser } from './dto/user.dto';
import { CustomValidatorPipe } from 'src/validation/validation.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(CustomValidatorPipe)
  async createUser(
    @Body()
    postData: RegisterUser,
  ): Promise<SuccessCreatingUser> {
    return await this.userService.signUp(postData);
  }

  @Delete('delete')
  @UsePipes(CustomValidatorPipe)
  async deleteUser(
    @Body()
    deleteData: DeleteUser,
  ): Promise<GeneralSuccess> {
    if (
      deleteData.password === undefined ||
      deleteData.username === undefined
    ) {
      throw new BadRequestException('username and password required');
    }
    return await this.userService.deleteUser(deleteData);
  }
}
