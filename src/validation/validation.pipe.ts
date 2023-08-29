import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GeneralError } from 'src/dto/response/error.dto';

@Injectable()
export class CustomValidatorPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);

    const errors = await validate(obj);

    if (errors.length > 0) {
      const missingFields = [];
      for (const error of errors) {
        const constraints = error.constraints;
        if (constraints) {
          missingFields.push(`${error.property}`);
        }
      }
      const FieldError: GeneralError = {
        message: 'Missing required field',
        detail: { fields: missingFields },
      };
      throw new BadRequestException(FieldError);
    }

    return value;
  }
}
