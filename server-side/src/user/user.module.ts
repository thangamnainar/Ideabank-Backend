import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SignUp } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerService } from 'src/mailer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignUp])
  ],
  controllers: [UserController],
  providers: [UserService,MailerService]
})
export class UserModule {}
