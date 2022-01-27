import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async isEmailExist(email: string): Promise<Boolean> {
    return await this.userModel.exists({ email });
  }

  async createUser(name: string, email: string, age: number, password: string): Promise<object> {
    return await this.userModel.create({
      name,
      email,
      age,
      password,
    });
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async getUserPassword(email: string): Promise<string> {
    return (await this.userModel.findOne({ email })).password;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findUserById(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  async checkPassword(password: string, dbPassword: string): Promise<Boolean> {
    return await bcrypt.compare(password, dbPassword);
  }
}
