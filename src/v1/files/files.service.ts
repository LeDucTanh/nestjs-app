import { IRequestUser } from 'src/utils/interface/request.interface';
import { In, Repository } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { FileUpload, FileStatus } from './entities/file-upload.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileUpload)
    private fileRepository: Repository<FileUpload>,
    private configService: ConfigService, // private readonly awsService: AWSService,
  ) {}

  async uploadFiles(files: Array<Express.Multer.File>, user: IRequestUser) {
    try {
      if (!files || files.length == 0) {
        throw new BadRequestException('FILE_IS_REQUIRED');
      }
      // eslint-disable-next-line prefer-const
      let data: any[] = [];
      if (files) {
        for await (const file of files) {
          const aws = await this.uploadFile(file, user);
          data.push(aws);
        }
      }
      return { files: data };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async uploadFile(file: Express.Multer.File, user: IRequestUser) {
    try {
      const uniqueSuffix = Math.round(Math.random() * 1e9);
      let fileName = `files/u/${user.userId}/${Date.now()}_${uniqueSuffix}.${
        file.mimetype.split('/')[1]
      }`;

      // const upload: any = await this.awsService.uploadFile(file, fileName);

      const fileData = {
        // url: `${this.configService.get('URL')}${upload.Key}`,
        // key: upload.Key,
        // path: upload.Key,
        // fileType: file.mimetype,
        // userId: user.id,
      };

      const data = await this.fileRepository.create(fileData);
      await this.fileRepository.save(data);
      return data;
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async deleteFile(fileId: number, user: IRequestUser) {
    try {
      const { userId } = user;
      const file = await this.fileRepository.findOne({
        where: {
          id: fileId,
          status: In([FileStatus.Active, FileStatus.Inactivate]),
          userId,
        },
      });

      if (!file) {
        throw new BadRequestException('FILE_NOT_FOUND');
      }

      await Promise.all([
        this.fileRepository.update(file.id, {
          status: FileStatus.Deleted,
        }),
        // this.awsService.deleteFile(file.key),
      ]);

      return { message: 'success' };
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  async getFileById(fileId: number) {
    const file = await this.fileRepository.findOne({
      where: {
        id: fileId,
        status: In([FileStatus.Active, FileStatus.Inactivate]),
      },
    });
    return file;
  }
}
