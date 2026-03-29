import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/CreateUserDto';
import CreateUserDtoValidator from './validators/CreateUserDtoValidator';
import { validate } from 'class-validator';

@Injectable()
export class UserDtoValidationPipe implements PipeTransform {
  async transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    if (metadata.type === "body") {
        const createUserDto = new CreateUserDtoValidator();
        createUserDto.email = value.email;
        createUserDto.password = value.password;

        const errors = await validate(createUserDto);
        if (errors.length > 0) throw new BadRequestException({message: "Validation error"});
        return value;
    }
  }
}

export default UserDtoValidationPipe;