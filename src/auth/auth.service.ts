import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { SigninDtoUser } from './dto/create-auto.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signin(body: SigninDtoUser) {
    const { email, password } = body;

    if (!(await this.userRepository.isEmailExist(email)))
      throw new UnauthorizedException('Error: Does Not Exist Email!');

    const user = await this.userRepository.findUserByEmail(email);

    if (!(await this.userRepository.checkPassword(password, user.password)))
      throw new UnauthorizedException('Error: Incrrect Password!');

    const payload = { email };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
