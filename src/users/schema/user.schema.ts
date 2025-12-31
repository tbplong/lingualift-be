import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserCollectionName } from 'src/constants/schema';

export type UserDocument = HydratedDocument<User>;

export class SocialMedia {
  @Prop()
  facebookUrl?: string;

  @Prop()
  facebookName?: string;
}

@Schema({ timestamps: true, collection: UserCollectionName })
export class User {
  @Prop({ required: false })
  public googleId: string;

  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public picture: string;

  @Prop({ default: null })
  public dateOfBirth: string;

  @Prop({ indexes: true, unique: true })
  public email: string;

  @Prop({ default: null })
  public phone: string;

  @Prop({ default: false })
  public isManager: boolean;

  @Prop({ default: false })
  public isBanned: boolean;

  @Prop()
  public password: string;

  @Prop({ required: false })
  public socialMedia?: SocialMedia;

  @Prop({ required: false })
  public highSchool?: string;

  @Prop({ required: false })
  public address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
