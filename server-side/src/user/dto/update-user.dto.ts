import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    isVerified: boolean;

    @ApiProperty()
    verifyotp: string;

    @ApiProperty()
    otp: string;
}
