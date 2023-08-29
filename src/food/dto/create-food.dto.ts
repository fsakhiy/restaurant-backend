import { IsNotEmpty } from 'class-validator';

export class CreateFoodDto {}

export class CreateFoodRequest {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  description?: string;
}
