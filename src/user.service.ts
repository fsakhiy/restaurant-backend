import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  my(): string {
    return 'this is your user';
  }
}
