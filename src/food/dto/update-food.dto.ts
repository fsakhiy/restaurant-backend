import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from './create-food.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}

export class UpdateFood {
  @IsNotEmpty()
  uuid: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  description: string;
}
