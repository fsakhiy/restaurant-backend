import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFoodRequest } from './dto/create-food.dto';
import { GeneralSuccess } from 'src/dto/response/success.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GeneralError } from 'src/dto/response/error.dto';

@Injectable()
export class FoodService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createFoodDto: CreateFoodRequest,
    userId: number,
  ): Promise<GeneralSuccess> {
    try {
      await this.prismaService.food.create({
        data: {
          name: createFoodDto.name,
          price: createFoodDto.price,
          description: createFoodDto.description,
          createdById: userId,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const err: GeneralError = {
          message: 'cannot create food',
          detail: e.message,
        };

        throw new BadRequestException(err);
      }

      const err: GeneralError = {
        message: 'cannot create food',
        detail: e,
      };
      throw new InternalServerErrorException(err);
    }

    const res: GeneralSuccess = {
      message: 'food created',
      detail: null,
    };

    return res;
  }
}
