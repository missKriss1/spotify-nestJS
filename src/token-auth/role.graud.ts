import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenAuthGuard } from './token-auth.guard';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthorized = await new TokenAuthGuard(this.userModel).canActivate(
      context,
    );
    if (!isAuthorized) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserDocument = request.user;

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('Сan only remove the admin role');
    }

    return true;
  }
}
