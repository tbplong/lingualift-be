import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Material, MaterialDocument } from './schemas/material.schema';

@Injectable()
export class MaterialsService {
  constructor(@InjectModel(Material.name) private model: Model<MaterialDocument>) {}

  create(input: {
    title: string;
    fileUrl: string;
    originalName: string;
    size: number;
    uploaderId: string;
    isPublic: boolean;
  }) {
    return this.model.create({
      ...input,
      uploaderId: new Types.ObjectId(input.uploaderId),
    });
  }

  listPublic() {
    return this.model.find({ isPublic: true }).sort({ createdAt: -1 }).lean();
  }
}
