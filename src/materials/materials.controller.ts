import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MaterialsService } from './materials.service';

function pdfFileFilter(
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, accepted: boolean) => void,
) {
  if (file.mimetype !== 'application/pdf') {
    return cb(new BadRequestException('Only PDF is allowed'), false);
  }
  cb(null, true);
}

function filenameFactory(
  _: any,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  cb(null, `material-${unique}${extname(file.originalname)}`);
}

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  // Teacher upload
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: filenameFactory,
      }),
      fileFilter: pdfFileFilter,
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('Missing PDF file');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const uploaderId = req.user?.id || req.user?._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    return this.materialsService.create({
      title: file.originalname,
      fileUrl,
      originalName: file.originalname,
      size: file.size,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      uploaderId,
      isPublic: true,
    });
  }

  // Tất cả user thấy danh sách
  @Get()
  async list() {
    return this.materialsService.listPublic();
  }
}
