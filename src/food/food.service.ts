import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFoodRequest } from './dto/create-food.dto';
import {
  GeneralSuccess,
  SuccessWithDataAuthor,
  // SuccessWithData,
  SuccessWithDataMeta,
} from 'src/dto/response/success.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GeneralError } from 'src/dto/response/error.dto';
import { UpdateFood } from './dto/update-food.dto';

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

  async getAll(page: number, pageSize: number): Promise<SuccessWithDataMeta> {
    const skip = (page - 1) * pageSize;

    const data = await this.prismaService.food.findMany({
      select: {
        uuid: true,
        name: true,
        price: true,
        description: true,
      },
      skip,
      take: pageSize,
      orderBy: { updatedAt: 'desc' },
    });
    if (!data) {
      const res: GeneralError = {
        message: 'data not found',
        detail: null,
      };
      throw new NotFoundException(res);
    }

    const foodWithNumbers = data.map((food) => ({
      ...food,
      price: parseFloat(food.price.toString()),
    }));

    const totalItem = await this.prismaService.food.count();
    const nextPage = page * pageSize < totalItem ? page + 1 : null;

    const res: SuccessWithDataMeta = {
      message: 'data retrieved',
      detail: {
        data: foodWithNumbers,
        meta: {
          currentPage: page,
          nextPage: nextPage,
          itemsShowed: pageSize,
          totalItems: totalItem,
        },
      },
    };

    return res;
  }

  async getOne(uuid: string): Promise<SuccessWithDataMeta> {
    const data = await this.prismaService.food.findFirst({
      where: {
        uuid: uuid,
      },
      select: {
        name: true,
        price: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const meta = await this.prismaService.food.findFirst({
      where: {
        uuid: uuid,
      },
      select: {
        createdBy: {
          select: {
            uuid: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!data) {
      const res: GeneralError = {
        message: 'cannot found data',
        detail: null,
      };
      throw new NotFoundException(res);
    }

    const res: SuccessWithDataAuthor = {
      message: 'data retrieved',
      detail: {
        data: data,
        meta: meta.createdBy,
      },
    };
    return res;
  }

  async update(data: UpdateFood): Promise<GeneralSuccess> {
    try {
      await this.prismaService.food.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          const res: GeneralError = {
            message: 'cannot create data',
            detail: 'data not found',
          };

          throw new BadRequestException(res);
        }
        const res: GeneralError = {
          message: 'cannot create data',
          detail: e.message,
        };

        throw new BadRequestException(res);
      }
    }

    const res: GeneralSuccess = {
      message: 'data updated',
      detail: null,
    };

    return res;
  }
}
