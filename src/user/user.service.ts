import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDtoUser } from './dto/create-user.dto';
import { errorHandlerUser, USER_REQUEST_ERROR } from './error/error';
import { responseParser } from 'src/common/error/error';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signup(body: CreateDtoUser) {
    const { name, email, age, password } = body;
    const { EXIST_EMAIL } = USER_REQUEST_ERROR;

    try {
      if (await this.userRepository.isEmailExist(email)) throw Error(EXIST_EMAIL);

      const hashPassword = await this.userRepository.hashPassword(password);
      await this.userRepository.createUser(name, email, age, hashPassword);

      return responseParser(
        {
          message: 'CREATED',
        },
        201,
      );
    } catch (error) {
      console.log(error);
      throw new BadRequestException(errorHandlerUser(error.message));
    }
  }
}
