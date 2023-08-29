import { Controller, Post, Body, UsePipes } from '@nestjs/common';
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
}
