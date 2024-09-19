import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageFile, ImageFileType } from './entities/image-file.entity';
import { fromPath } from 'pdf2pic';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

@Injectable()
export class ImageFileService {
  constructor(
    @InjectRepository(ImageFile)
    private imageFileRepository: Repository<ImageFile>,
  ) {}

  create(createImageFileDto: any) {
    const imageFile = this.imageFileRepository.create(createImageFileDto);
    return this.imageFileRepository.save(imageFile);
  }

  findOne(id: number) {
    return this.imageFileRepository.findOneBy({ id });
  }

  async findAll(type: ImageFileType) {
    return this.imageFileRepository.find({ where: { type } });
  }

  // async findAll(type: ImageFileType) {
  //   return this.imageFileRepository.find({
  //     where: [
  //       { type, page: 1 },
  //       { type, page: 2 },
  //     ],
  //   });
  // }

  async convertPdfToImage(type: ImageFileType, file: Express.Multer.File) {
    try {
      const outputDir = path.join(process.cwd(), 'output');

      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Get the number of pages in the PDF
      console.log('file', file);
      const pdfData = await pdfParse(file.buffer);
      const numPages = pdfData.numpages;

      console.log(`Total pages in PDF: ${numPages}`);

      const options = {
        density: 300,
        saveFilename: 'img',
        savePath: outputDir,
        format: 'png',
        width: 612 * 3,
        height: 792 * 3,
      };

      // Write the buffer to a temporary file
      const tempPdfPath = path.join(outputDir, 'temp.pdf');
      fs.writeFileSync(tempPdfPath, file.buffer);

      const storeAsImage = fromPath(tempPdfPath, options);

      // Loop through each page
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        console.log(`Processing page ${pageNum}`);

        const result = await storeAsImage(pageNum);
        console.log(`Page ${pageNum} conversion result:`, result);

        const imagePath = path.join(
          outputDir,
          `${options.saveFilename}.${pageNum}.png`,
        );

        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);

        // Create and save ImageFile entity
        const imageFile = this.imageFileRepository.create({
          filename: `${
            options.saveFilename
          }_${type.toLowerCase()}_${pageNum}.png`,
          data: imageBuffer,
          page: pageNum,
          type: type,
        });

        await this.imageFileRepository.save(imageFile);

        // Remove the temporary image file
        fs.unlinkSync(imagePath);
      }

      // Remove the temporary PDF file
      fs.unlinkSync(tempPdfPath);

      // Remove the output directory
      fs.rmdirSync(outputDir);
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
