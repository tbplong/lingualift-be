import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  fileUrl: string; // URL để user xem

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploaderId: Types.ObjectId;

  @Prop({ default: true })
  isPublic: boolean; // true = tất cả user thấy
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
