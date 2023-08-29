import { IsNotEmpty } from 'class-validator';

export class DeleteUser {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}

export class RegisterUser {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  email: string;
}
