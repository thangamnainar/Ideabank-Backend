import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignUp } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(SignUp)
    private readonly userRepository: Repository<SignUp>,
  ) { }


  async checkEmail(email: string) {
    return await this.userRepository.findOne({ select: ['id', 'email', 'password', 'isVerified', 'verification_code', 'attempt_Count', 'attempt_Time'], where: { email: email } });
  }

  async updateVerificationCode(id: number, updateUserDto: any) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async createUser(createUserDto: any) {
    // console.log('createUserDto serviceeeeeeeee',createUserDto);    
    return await this.userRepository.save(createUserDto);
  }

  async updateAttemptCount(id: any, loginUserDto: any) {
    return await this.userRepository.update(id, loginUserDto)

  }

  async updatePassword(id: number, updateUserDto: any) {
    return await this.userRepository.update(id, updateUserDto);
  }

  searchUsers(searchQuery: string) {
    console.log('searchQuery ssssssssssss', searchQuery);

    return this.userRepository.findOne({
      where: {
        userName: Like(`%${searchQuery}%`)
      }
    });
  }




 async getAllUser() {
    return await this.userRepository.find({ select: ['id', 'userName', 'email'] });
  }


  async searchUser(searchQuery: string) {
    console.log('searchQuery ssssssssssss', searchQuery);
    return await this.userRepository.createQueryBuilder('u')
      .select('u.id, u.userName, u.email')
      .where('u.userName LIKE :search or u.email LIKE :search', { search: `%${searchQuery}%` })
      .getRawMany();
  }




}

