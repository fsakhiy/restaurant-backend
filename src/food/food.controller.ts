import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodRequest } from './dto/create-food.dto';
import { CustomValidatorPipe } from 'src/validation/validation.pipe';
import { UpdateFood } from './dto/update-food.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(CustomValidatorPipe)
  create(@Body() createFoodDto: CreateFoodRequest) {
    return this.foodService.create(createFoodDto, 1);
  }

  @UseGuards(AuthGuard)
  @Get()
  listAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.foodService.getAll(page, pageSize);
  }

  @UseGuards(AuthGuard)
  @Get(':uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.foodService.getOne(uuid);
  }

  @UseGuards(AuthGuard)
  @Put()
  @UsePipes(new CustomValidatorPipe())
  update(@Body() updateFood: UpdateFood) {
    return this.foodService.update(updateFood);
  }
}
