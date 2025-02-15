import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterUserDto } from './register-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../token-auth/token-auth.guard';
import { randomUUID } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', { dest: './public/images/avatar' }),
  )
  registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: UserDocument = new this.userModel({
      username: registerUserDto.username,
      password: registerUserDto.password,
      displayName: registerUserDto.displayName,
      role: registerUserDto.role,
      avatar: file ? '/images/avatar' + file.filename : null,
    });
    user.generateToken();
    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request<{ user: User }>) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Get('secret')
  secret(@Req() req: Request<{ user: User }>) {
    return { user: req.user, message: 'Secret info' };
  }

  @UseGuards(TokenAuthGuard)
  @Delete('sessions')
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserDocument;

    try {
      const logoutUser = await this.userModel.findOne({ _id: user._id });

      if (logoutUser) {
        logoutUser.token = randomUUID();
        await logoutUser.save();

        res
          .status(200)
          .json({ message: 'You have successfully logged out of the system.' });
        return;
      } else {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
