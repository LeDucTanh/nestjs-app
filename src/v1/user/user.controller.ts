import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';

import { UserService } from './user.service';
import { IRequest } from 'src/utils/interface/request.interface';
import { USER_PERMISSION } from '../auth/permission/permission';
import { Auth } from '../auth/decorator/auth.decorator';
import { UpdateUserDto } from './dto/users.dto';
import { Response as ResponseExpress } from 'express';

import { fromPath } from 'pdf2pic';
import * as fs from 'fs';
import * as path from 'path';
import * as tesseract from 'node-tesseract-ocr';
import pdfParse from 'pdf-parse';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Put()
  @Auth(USER_PERMISSION)
  async update(@Body() dto: UpdateUserDto, @Req() req: IRequest) {
    return this.userService.updateUser(dto, req.user);
  }

  @Get('me')
  @Auth(USER_PERMISSION)
  getMe(@Req() req: IRequest) {
    return this.userService.getMe(req.user);
  }

  @Get('convert-pdf')
  // @Auth(USER_PERMISSION)
  async convertPdfToImage(@Res() res: ResponseExpress) {
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
          psm: 11,
        };

        const text = await tesseract.recognize(imagePath, config);

        allPagesText.push({
          page: pageNum,
          text: text.trim(),
        });

        // console.log(`Extracted text from page ${pageNum}:`, text);
      }

      // Set the appropriate headers
      res.setHeader('Content-Type', 'application/json');

      // Send all pages' text
      return res.json({
        totalPages: numPages,
        extractedText: allPagesText,
      });
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
}
