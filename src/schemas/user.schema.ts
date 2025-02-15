import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

const SALT_WORK_FACTOR = 10;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  token: string;
  @Prop({ required: true, default: 'user' })
  role: string;
  @Prop({ required: true })
  displayName: string;
  @Prop({ default: null })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = randomUUID();
};

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
