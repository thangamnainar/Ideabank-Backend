import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from 'src/mailer.service';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private mailerService: MailerService) { }


  @Post('createUser')
  async createUser(@Req() req: Request, @Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      let email = createUserDto.email;
      console.log(createUserDto, 'createUserDto');
      let password = createUserDto.password;
      const checkEmail = await this.userService.checkEmail(email);
      // console.log(checkEmail); 
      if (checkEmail) {
        if (checkEmail.isVerified == 1) {
          return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'Something went wrong', status: false });
        } else {
          const verifyCode = this.mailerService.generateVerificationCode();
          let generateOtpTime = Date.now();
          const hashPassword = await bcrypt.hash(password, 10);
          await this.userService.updateVerificationCode(checkEmail.id, { verification_code: verifyCode, password: hashPassword, attempt_Time: generateOtpTime });
          // console.log("email",email);          
          // await this.mailerService.sendMail(email, 'Verify Email', `Please verify your email ${verifyCode}`);
          console.log('Email sent');
          return res.status(HttpStatus.OK).json({ message: 'Check Your Mail', status: true });
        }
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        createUserDto.password = hashPassword;
        const userCreated = await this.userService.createUser(createUserDto);
        const verification_code = this.mailerService.generateVerificationCode();
        let generateOtpTime = Date.now();
        await this.userService.updateVerificationCode(userCreated.id, { verification_code: verification_code, attempt_Time: generateOtpTime });
        // await this.mailerService.sendMail(email, 'Verify Email', `Please verify your email ${verification_code}`);
        console.log(userCreated);
        return res.status(HttpStatus.OK).json({ message: 'Check Your Mail', status: true });
      }
    } catch (err) {
      console.log(err);
    }
  }


  @Put('verifyOtp')
  async verifyOTP(@Req() req: Request, @Res() res: Response, @Body() updateUserDto: UpdateUserDto) {
    try {
      let email = updateUserDto.email;
      let verifyotp = updateUserDto.verifyotp;
      let maxTime = 1 * 60 * 1000;
      console.log(email, verifyotp);
      // console.log(updateUserDto);
      const checkEmail = await this.userService.checkEmail(email);
      console.log(checkEmail);

      if (checkEmail) {
        let currentTime = Date.now();
        // console.log(currentTime - +checkEmail.attempt_Time, '""""""""""""""""""""""""""');
        if (+checkEmail.verification_code === +verifyotp) {
          if ((currentTime - +checkEmail.attempt_Time) < maxTime) {
            this.userService.updateVerificationCode(checkEmail.id, { isVerified: 1, verification_code: null, attempt_Time: null });
            return res.status(HttpStatus.OK).json({ message: 'Account Verified', status: true });
          } else {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: ' OTP Expired', status: false });
          }
        } else {
          return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'Invalid OTP', status: false });
        }

      } else {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'Email not ex ists', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }



  @Post('login')
  async login(@Req() req: Request, @Res() res: Response, @Body() loginUserDto: CreateUserDto) {
    try {
      let email = loginUserDto.email;
      let password = loginUserDto.password;
      // console.log(email, password);
      const checkEmail = await this.userService.checkEmail(email);
      // console.log(checkEmail);
      let maxTime = 1 * 60 * 1000;
      if (checkEmail && checkEmail.isVerified == 1) {
        const match = await bcrypt.compare(password, checkEmail.password);
        if (match) {
          if (checkEmail.attempt_Count < 3) {
            await this.userService.updateAttemptCount(checkEmail.id, { attempt_Count: 0, attempt_Time: null });
            return res.status(HttpStatus.OK).json({ message: 'login success', status: true });
          } else {
            let current_Time = Date.now();
            if ((current_Time - +checkEmail.attempt_Time) > maxTime) {
              await this.userService.updateAttemptCount(checkEmail.id, { attempt_Count: 0, attempt_Time: null });
              console.log('un Block');
              return res.status(HttpStatus.OK).json({ message: 'Login Success', status: true });
            }
            console.log('blocked');

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Your Too many long incorrect password', status: false });
          }
        } else {
          const attempt_Time = Date.now();
          // console.log(attempt_Time);
          let thrrottleCount = checkEmail.attempt_Count;
          await this.userService.updateAttemptCount(checkEmail.id, { attempt_Count: thrrottleCount + 1, attempt_Time: attempt_Time });
          console.log('password not match');
          return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'invalid user Or password', status: false });
        }
      } else {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'invalid user Or password', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }


  @Post('getMail')
  async forgotPassword(@Req() req: Request, @Res() res: Response, @Body() forgotPasswordDto: CreateUserDto) {
    try {
      let email = forgotPasswordDto.email;
      console.log(email);
      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail && checkEmail.isVerified == 1) {
        const verifyCode = this.mailerService.generateVerificationCode();
        let generateOtpTime = Date.now();
        await this.userService.updateVerificationCode(checkEmail.id, { verification_code: verifyCode, attempt_Time: generateOtpTime });
        // await this.mailerService.sendMail(email, 'Verify Email', `Please verify your email ${verifyCode}`);
        console.log('Email sent');
        return res.status(HttpStatus.OK).json({ message: 'Check Your Mail', status: true });
      } else {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ message: 'Something went wrong ', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }


  @Put('verifyOtpForgotPassword')
  async verifyOtpForgotPassword(@Req() req: Request, @Res() res: Response, @Body() updateUserDto: UpdateUserDto) {
    try {
      let email = updateUserDto.email;
      let verifyotp = updateUserDto.verifyotp;
      console.log(updateUserDto);
      let maxTime = 1 * 60 * 1000;
      let current_Time2 = Date.now();
      // console.log(current_Time2);

      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail) {
        // console.log(+checkEmail.attempt_Time);          
        if (+checkEmail.verification_code === +(verifyotp)) {
          if ((current_Time2 - +checkEmail.attempt_Time) < maxTime) {
            return res.status(HttpStatus.OK).json({ message: 'otp verified', status: true });
          } else {
            console.log(+checkEmail.attempt_Time);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'OTP Expired', status: false });
          }
        } else {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Invalid OTP', status: false });
        }
      } else {
        return res.status(HttpStatus.OK).json({ message: 'Email not ex ists', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }



  @Put('resetPassword')
  async resetPassword(@Req() req: Request, @Res() res: Response, @Body() resetPasswordDto: UpdateUserDto) {
    try {
      let email = resetPasswordDto.email;
      let verifyotp = resetPasswordDto.otp;
      let password = resetPasswordDto.password;
      // console.log(resetPasswordDto, verifyotp);
      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail) {
        if (+checkEmail.verification_code === +verifyotp) {
          const hash = await bcrypt.hash(password, 10);
          this.userService.updatePassword(checkEmail.id, { verification_code: null, password: hash });
          this.userService.updateVerificationCode(checkEmail.id, { verification_code: null });
          return res.status(HttpStatus.OK).json({ message: 'Reset password successfully', status: true });
        } else {
          return res.status(HttpStatus.OK).json({ message: 'invalid otp', status: false });
        }
      } else {
        return res.status(HttpStatus.OK).json({ message: 'Email not ex ists', status: false });
      }

    } catch (err) {
      console.log(err);
    }
  }

  @Put('signUpReSendMail')
  async signUpReSendMail(@Req() req: Request, @Res() res: Response, @Body() reSendMailDto: UpdateUserDto) {
    try {
      let email = reSendMailDto.email;
      console.log(email);

      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail) {
        const verifyCode = this.mailerService.generateVerificationCode();
        let generateOtpTime = Date.now();
        await this.userService.updateVerificationCode(checkEmail.id, { verification_code: verifyCode, attempt_Time: generateOtpTime });
        await this.mailerService.sendMail(email, 'Verify Email', `Please verify your email ${verifyCode}`);
        console.log('Email sent');
        return res.status(HttpStatus.OK).json({ message: 'Check Your Mail', status: true });
      } else {
        return res.status(HttpStatus.OK).json({ message: 'some thing wrong', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Put('reSendMail')
  async reSendMail(@Req() req: Request, @Res() res: Response, @Body() reSendMailDto: any) {
    try {
      let email = reSendMailDto.email;
      console.log(email);

      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail && checkEmail.isVerified == 1) {
        const verifyCode = this.mailerService.generateVerificationCode();
        let generateOtpTime = Date.now();
        await this.userService.updateVerificationCode(checkEmail.id, { verification_code: verifyCode, attempt_Time: generateOtpTime });
        await this.mailerService.sendMail(email, 'Verify Email', `Please verify your email ${verifyCode}`);
        console.log('Email sent');
        return res.status(HttpStatus.OK).json({ message: 'Check Your Mail', status: true });
      } else {
        return res.status(HttpStatus.OK).json({ message: 'some thing wrong', status: false });
      }
    } catch (err) {
      console.log(err);
    }
  }

  //search user


  @Get('getall')
  async getAllUser(@Req() req: Request, @Res() res: Response,) {
    try {
      // console.log(search);
      console.log(req.query.search);
      let search = req.query.search as string;

      if (search) {
        const searchUser = await this.userService.searchUser(search);
        console.log(searchUser, 'searchUser');
        return res.status(HttpStatus.OK).json({ message: 'Search User...', data: searchUser, status: true });
      } else {
        const allUser = await this.userService.getAllUser();
        console.log(allUser, 'allUser');

        return res.status(HttpStatus.OK).json({ message: 'All User', data: allUser, status: true });
      }

    } catch (err) {
      console.log(err);
    }
  }

  // get from Form details table

  @Get('getFormFields')
  async getFormFields(@Req() req: Request, @Res() res: Response,) {
    try {
      const getFormFields = await this.userService.getFormFields();
      return res.status(HttpStatus.OK).json({ message: "success", data: getFormFields, status: true })
    } catch (err) {
      console.log(err);
      
    }
  }


  // get from gender table

  @Get('getGender')
  async getGender(@Req() req: Request, @Res() res: Response,) {
    try {
      const getGender = await this.userService.getGender();
      return res.status(HttpStatus.OK).json({ message: "success", data: getGender, status: true })
    } catch (err) {
    }
  }
// ADD USER TABLE
  @Post('addUser')
  async addUser(@Req() req: Request, @Res() res: Response, @Body() addGenderDto: CreateUserDto) {
    try {
      console.log(addGenderDto,'addGenderDto');      
      const createUser = await this.userService.createFormFields(addGenderDto);
      const addGender = await this.userService.createGenderMapping(createUser.id,addGenderDto.gender);
      const addDistrict = await this.userService.createDistrictMapping(createUser.id,addGenderDto.selectedCity.id);
      return res.status(HttpStatus.OK).json({ message: "success", data: createUser, status: true })
    } catch (err) {
      console.log(err);      
    }
  }

  // get from district table

  @Get('getDistrict')
  async getDistrict(@Req() req: Request, @Res() res: Response,) {
    try {
      const getDistrict = await this.userService.getDistrict();
      return res.status(HttpStatus.OK).json({ message: "success", data: getDistrict, status: true })
    } catch (err) {
      console.log(err);      
    }
  }
}
