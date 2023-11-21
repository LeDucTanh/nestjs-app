import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IRequest } from 'src/utils/interface/request.interface';
import { Auth } from '../auth/decorator/auth.decorator';
import { ANY_PERMISSION } from '../auth/permission/permission';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: IRequest,
  ) {
    const data = await this.filesService.uploadFiles(files, req.user);
    return data;
  }

  @Delete(':id')
  @Auth(ANY_PERMISSION)
  async deleteFile(@Param('id') id: string, @Req() req: IRequest) {
    const data = await this.filesService.deleteFile(+id, req.user);
    return data;
  }
}
