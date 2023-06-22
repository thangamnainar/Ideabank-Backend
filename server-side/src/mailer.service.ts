import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      secure: false,
      auth: {
        user: '60cc2fe1d38f9b',
        pass: '514bc49047f320',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {

    console.log('to',to);
    

    await this.transporter.sendMail({
      from: 'thangam.nainar0507@gmail.com',
      to: to,
      subject:subject,
      text: text,
    });
  }

   generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }
}
