import {
  Controller,
  Post,
  Body,
  UsePipes,
  Get,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodRequest } from './dto/create-food.dto';
import { CustomValidatorPipe } from 'src/validation/validation.pipe';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post()
  @UsePipes(CustomValidatorPipe)
  create(@Body() createFoodDto: CreateFoodRequest) {
    return this.foodService.create(createFoodDto, 1);
  }

  @Get()
  listAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return this.foodService.getAll(page, pageSize);
  }
}
