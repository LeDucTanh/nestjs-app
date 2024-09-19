import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { BaseService } from 'src/base/base.service';
import { AuthenticationService } from 'src/v1/auth/authen.service';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto, RegisterUserDto } from './dto/users.dto';
import { IRequestUser } from 'src/utils/interface/request.interface';
import { In } from 'typeorm';
import { ADMIN_PERMISSION } from '../auth/permission/permission';
import { fromPath } from 'pdf2pic';
import * as fs from 'fs';
import * as path from 'path';
import * as tesseract from 'node-tesseract-ocr';
import pdfParse from 'pdf-parse';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(
    private readonly repo: UserRepository,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authenticationService: AuthenticationService,
  ) {
    super(repo);
  }

  async convertPdfToImage() {
    try {
      const pdfPath = path.join(process.cwd(), 'Test1.pdf');
      const outputDir = path.join(process.cwd(), 'output');

      if (!fs.existsSync(pdfPath)) {
        throw new Error('PDF file not found');
      }

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Get the number of pages in the PDF
      const dataBuffer = fs.readFileSync(pdfPath);
      const pdfData = await pdfParse(dataBuffer);
      const numPages = pdfData.numpages;

      console.log(`Total pages in PDF: ${numPages}`);

      const options = {
        density: 300,
        saveFilename: 'output',
        savePath: outputDir,
        format: 'png',
        width: 612 * 3,
        height: 792 * 3,
      };

      const storeAsImage = fromPath(pdfPath, options);

      let allPagesText = [];

      // Loop through each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        console.log(`Processing page ${pageNum}`);

        const result = await storeAsImage(pageNum);
        console.log(`Page ${pageNum} conversion result:`, result);

        const imagePath = path.join(
          outputDir,
          `${options.saveFilename}.${pageNum}.png`,
        );

        // Perform OCR on the image
        const config = {
          lang: 'vie+jpn',
          oem: 1,
          psm: 12,
        };

        const text = await tesseract.recognize(imagePath, config);

        allPagesText.push({
          page: pageNum,
          text: text.trim(),
        });

        // console.log(`Extracted text from page ${pageNum}:`, text);
      }

      return allPagesText;
    } catch (error) {
      console.error('Error processing PDF:', error);
      if (error.message.includes('GraphicsMagick/ImageMagick')) {
        throw new Error(
          "GraphicsMagick/ImageMagick is not installed or not in PATH. Please install it and ensure it's in your system's PATH.",
        );
      } else {
        throw new Error('Failed to process PDF: ' + error.message);
      }
    }
  }

  async register(dto: RegisterUserDto) {
    const checkUser = await this.repo.findOne({
      where: [
        { email: dto.email, status: UserStatus.Active, role: UserRole.User },
        {
          phoneNumber: dto.phoneNumber,
          status: UserStatus.Active,
          role: UserRole.User,
        },
      ],
    });

    if (checkUser && checkUser.email == dto.email) {
      throw new BadRequestException('EMAIL_EXISTED');
    }

    if (checkUser && checkUser.phoneNumber == dto.phoneNumber) {
      throw new BadRequestException('PHONE_NUMBER_EXISTED');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('PASSWORD_NOT_MATCH');
    }

    delete dto.confirmPassword;

    return await this.repo.create(dto);
  }

  async login(idLogin: string, password: string): Promise<User> {
    const user = await this._findOne(idLogin);
    if (!user) {
      throw new NotFoundException('ACCOUNT_NOT_REGISTERED');
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestException('WRONG_PASSWORD');
    }

    return user;
  }

  async getMe(reqUser: IRequestUser) {
    return this.repo.findOne({
      where: {
        id: reqUser.userId,
        status: UserStatus.Active,
        role: UserRole.User,
      },
    });
  }

  async adminLogin(email: string, password: string): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        email,
        role: In(ADMIN_PERMISSION),
        status: UserStatus.Active,
      },
    });
    if (!user) {
      throw new NotFoundException('ACCOUNT_NOT_REGISTERED');
    }

    const isMatching = await compare(password, user.password);

    if (!isMatching) {
      throw new BadRequestException('WRONG_PASSWORD');
    }

    return user;
  }

  async updateUser(dto: UpdateUserDto, user: IRequestUser) {
    const userUpdate = await this.repo.findOne({
      where: {
        id: user.userId,
        status: UserStatus.Active,
      },
    });
    if (!userUpdate) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return this.repo.updateOneAndReturnById(user.userId, dto, null);
  }

  private async _findOne(email: string) {
    return this.repo.findOne({
      where: {
        email,
        role: UserRole.User,
        status: UserStatus.Active,
      },
    });
  }
}
