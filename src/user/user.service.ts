import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDtoUser } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signup(body: CreateDtoUser) {
    const { name, email, age, password } = body;

    if (await this.userRepository.isEmailExist(email))
      throw new UnauthorizedException('Error: Exist Email!');

    const hashPassword = await this.userRepository.hashPassword(password);

    return this.userRepository.createUser(name, email, age, hashPassword);
  }
}
