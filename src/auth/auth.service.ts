import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { responseParser } from 'src/common/error/error';
import { UserRepository } from 'src/user/user.repository';
import { SigninDtoUser } from './dto/create-auto.dto';
import { AUTH_REQUEST_ERROR, errorHandlerAuth } from './error/error';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private jwtService: JwtService) {}

  async signin(body: SigninDtoUser) {
    const { email, password } = body;
    const { INCORRECT_PASSOWRD } = AUTH_REQUEST_ERROR;

    try {
      const userPassword = await this.userRepository.getUserPassword(email);
      const checkPassword = await this.userRepository.checkPassword(password, userPassword);

      if (!checkPassword) throw Error(INCORRECT_PASSOWRD);

      const payload = { email };

      return responseParser(
        {
          token: this.jwtService.sign(payload),
        },
        201,
      );
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(errorHandlerAuth(error.message));
    }
  }
}
