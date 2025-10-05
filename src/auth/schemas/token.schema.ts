import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { HydratedDocument, Types } from 'mongoose';
import { TokenCollectionName, UserCollectionName } from 'src/constants/schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema({ timestamps: true, collection: TokenCollectionName })
export class Token {
  @Prop({ type: Types.ObjectId, required: true, ref: UserCollectionName })
  public userId: Types.ObjectId;

  @Prop({ default: true })
  public isActivate: boolean;

  @Prop({ default: () => dayjs().add(365, 'day').toDate() })
  public expiredAt: Date;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
