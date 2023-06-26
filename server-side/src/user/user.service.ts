import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { District, DistrictMapping, FormFileds, Gender, GenderMapping, SignUp } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(SignUp)
    private readonly userRepository: Repository<SignUp>,
    @InjectRepository(Gender)
    private genderRepository: Repository<Gender>,
    @InjectRepository(FormFileds)
    private formFiledsRepository: Repository<FormFileds>,
    @InjectRepository(GenderMapping)
    private genderMappingRepository: Repository<GenderMapping>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(DistrictMapping)
    private districtMappingRepository: Repository<DistrictMapping>,

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


  // get from form fields table

  async getFormFields() {
    return await this.formFiledsRepository.createQueryBuilder('Ftable')
    .leftJoin(GenderMapping, 'gm', 'gm.userId = Ftable.id')
    .innerJoin(Gender, 'g', 'g.id = gm.genderId')
    .leftJoin(DistrictMapping, 'dm', 'dm.userId = Ftable.id')
    .innerJoin(District, 'd', 'd.id = dm.districtId')
    .select('Ftable.id, Ftable.userName, g.genderName as gender, d.districtName as district')
    .getRawMany();
  }

  //form fields table

  async createFormFields(createFormFieldsDto: any) {
    return await this.formFiledsRepository.save({userName:createFormFieldsDto.userName});
  }

  // Gender table

  async getGender() {
    return await this.genderRepository.find({ select: ['id', 'genderName'] });
  }
  //gender mapping table

  async createGenderMapping(userid: number, genderid: number) {
    console.log('useridd', userid, 'genderid', genderid);

    return await this.genderMappingRepository.save({ userId: userid, genderId: genderid });
  }

  //district table`

  async getDistrict() {
    return await this.districtRepository.find({ select: ['id', 'districtName'] });
  }

  //district mapping table

  async createDistrictMapping(userid: number, districtid: number) {
    console.log('useridd', userid, 'districtid', districtid);

    return await this.districtMappingRepository.save({ userId: userid, districtId: districtid });
  }
}

