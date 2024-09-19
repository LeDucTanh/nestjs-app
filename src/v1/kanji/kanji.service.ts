import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kanji } from './entities/kanji.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as tesseract from 'node-tesseract-ocr';
import { ImageFileService } from '../image-file/image-file.service';
import { ImageFileType } from '../image-file/entities/image-file.entity';
import cv from '@u4/opencv4nodejs';
import { fromPath } from 'pdf2pic';
import pdfParse from 'pdf-parse';

export enum FilterOptionType {
  Name = 'name',
  Meaning = 'meaning',
}

@Injectable()
export class KanjiService {
  constructor(
    @InjectRepository(Kanji)
    private kanjiRepository: Repository<Kanji>,
    private readonly imageFileService: ImageFileService,
  ) {}

  async searchKanji(
    searchTerm: string,
    filterOption: FilterOptionType,
  ): Promise<Kanji[]> {
    if (!searchTerm) {
      return [];
    }

    const normalizedSearchTerm = this.normalizeVietnamese(
      searchTerm.toLowerCase(),
    );

    const queryBuilder = this.kanjiRepository
      .createQueryBuilder('kanji')
      .leftJoin('kanji.imageFile', 'imageFile')
      .addSelect(['imageFile.type', 'imageFile.page']);

    switch (filterOption) {
      case FilterOptionType.Name:
        queryBuilder.where('LOWER(kanji.name) LIKE :searchTerm', {
          searchTerm: `${normalizedSearchTerm}`,
        });
        break;
      case FilterOptionType.Meaning:
        queryBuilder.where('LOWER(kanji.meaning) LIKE :searchTerm', {
          searchTerm: `%${normalizedSearchTerm}%`,
        });
        break;
      default:
        throw new Error('Invalid filter option');
    }

    return queryBuilder.getMany();
  }

  private normalizeVietnamese(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  async cropKanjiImages(imageFileType: ImageFileType) {
    const psm = 6;
    const imageFiles = await this.imageFileService.findAll(imageFileType);

    for (const imageFile of imageFiles) {
      const image = await cv.imdecodeAsync(imageFile.data);
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      const thresh = gray.threshold(
        0,
        255,
        cv.THRESH_BINARY_INV + cv.THRESH_OTSU,
      );
      const contours = thresh.findContours(
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE,
      );

      for (let index = 0; index < contours.length; index++) {
        const contour = contours[index];
        const rect = contour.boundingRect();
        const { x, y, width: w, height: h } = rect;

        if (w > 1200 && h > 280) {
          const roi = image.getRegion(new cv.Rect(x, y, w, h));

          if (roi.rows > 310) {
            // Crop the image further, leaving 70 pixels from the left
            const croppedRoi = roi.getRegion(
              new cv.Rect(70, 0, roi.cols - 70, roi.rows),
            );

            // Convert to grayscale
            const gray = croppedRoi.cvtColor(cv.COLOR_BGR2GRAY);

            // Apply threshold
            const thresh = gray.threshold(
              0,
              255,
              cv.THRESH_BINARY_INV + cv.THRESH_OTSU,
            );

            // Find contours
            const contours2 = thresh.findContours(
              cv.RETR_EXTERNAL,
              cv.CHAIN_APPROX_SIMPLE,
            );

            // Loop through contours and check if dimensions meet criteria
            for (let id = 0; id < contours2.length; id++) {
              const contour = contours2[id];
              const rect2 = contour.boundingRect();
              const { x: x2, y: y2, width: w2, height: h2 } = rect2;
              if (w2 > 1130 && h2 > 280) {
                const roi2 = croppedRoi.getRegion(new cv.Rect(x2, y2, w2, h2));
                // Crop the image further
                const croppedRoi2 = roi2.getRegion(new cv.Rect(0, 0, 146, 208));

                // Convert the cropped image to a buffer
                const buffer = cv.imencode('.jpg', croppedRoi2);

                // Perform OCR on the cropped image
                const config = {
                  lang: 'vie+jpn',
                  oem: 1,
                  psm,
                };

                try {
                  const text = await tesseract.recognize(buffer, config);
                  const lastTwoParts = this.splitText(text.trim());

                  // Create and save Kanji entity
                  const kanjiEntity = this.kanjiRepository.create({
                    name: lastTwoParts[0]?.toUpperCase(),
                    meaning: lastTwoParts[1],
                    imageFileId: imageFile.id,
                    text: JSON.stringify(text.trim()),
                  });

                  console.log('imageFileId:', imageFile.id);
                  await this.kanjiRepository.save(kanjiEntity);
                } catch (error) {
                  throw new HttpException(
                    `Error extracting text from image ${imageFile.id}, contour ${index}: ${error.message}`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  );
                }
              }
            }
          } else {
            // if rows <= 310
            // Crop the image further
            const croppedRoi = roi.getRegion(new cv.Rect(70, 0, 146, 208));

            // Convert the cropped image to a buffer
            const buffer = cv.imencode('.jpg', croppedRoi);

            // Perform OCR on the cropped image
            const config = {
              lang: 'vie+jpn',
              oem: 1,
              psm,
            };

            try {
              const text = await tesseract.recognize(buffer, config);
              const lastTwoParts = this.splitText(text.trim());

              // Create and save Kanji entity
              const kanjiEntity = this.kanjiRepository.create({
                name: lastTwoParts[0]?.toUpperCase(),
                meaning: lastTwoParts[1],
                imageFileId: imageFile.id,
                text: JSON.stringify(text.trim()),
              });

              console.log('imageFileId:', imageFile.id);
              await this.kanjiRepository.save(kanjiEntity);
            } catch (error) {
              throw new HttpException(
                `Error extracting text from image ${imageFile.id}, contour ${index}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          }
        }
      }
    }
  }

  private splitText(text: string) {
    const parts = text.trim().split('\n');
    const result = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] !== '') {
        result.unshift(parts[i]);
      }
      if (result.length === 2) {
        break;
      }
    }
    return result;
  }

  async detectAndCropImages() {
    const pdfPath = path.join(process.cwd(), 'Test1.pdf');
    const outputDir = path.join(process.cwd(), 'output');
    const croppedDir = path.join(process.cwd(), 'croppedImage');

    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF file not found');
    }

    // Create output and cropped directories if they don't exist
    [outputDir, croppedDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Get the number of pages in the PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const numPages = pdfData.numpages;

    const options = {
      density: 300,
      saveFilename: 'output',
      savePath: outputDir,
      format: 'png',
      width: 612 * 3,
      height: 792 * 3,
    };

    const storeAsImage = fromPath(pdfPath, options);

    // Loop through each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      console.log(`Processing page ${pageNum}`);

      const result = await storeAsImage(pageNum);
      console.log(`Page ${pageNum} conversion result:`, result);

      const imagePath = path.join(
        outputDir,
        `${options.saveFilename}.${pageNum}.png`,
      );

      // Process the converted image
      const image = await cv.imreadAsync(imagePath);
      const gray = image.cvtColor(cv.COLOR_BGR2GRAY);
      const thresh = gray.threshold(
        0,
        255,
        cv.THRESH_BINARY_INV + cv.THRESH_OTSU,
      );
      const contours = thresh.findContours(
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE,
      );

      for (let index = 0; index < contours.length; index++) {
        const contour = contours[index];
        const rect = contour.boundingRect();
        const { x, y, width: w, height: h } = rect;

        if (w > 1200 && h > 280) {
          const roi = image.getRegion(new cv.Rect(x, y, w, h));

          if (roi.rows > 310) {
            // Crop the image further, leaving 70 pixels from the left
            const croppedRoi = roi.getRegion(
              new cv.Rect(70, 0, roi.cols - 70, roi.rows),
            );

            // Convert to grayscale
            const gray = croppedRoi.cvtColor(cv.COLOR_BGR2GRAY);

            // Apply threshold
            const thresh = gray.threshold(
              0,
              255,
              cv.THRESH_BINARY_INV + cv.THRESH_OTSU,
            );

            // Find contours
            const contours2 = thresh.findContours(
              cv.RETR_EXTERNAL,
              cv.CHAIN_APPROX_SIMPLE,
            );

            // Loop through contours and check if dimensions meet criteria
            for (let id = 0; id < contours2.length; id++) {
              const contour = contours2[id];
              const rect2 = contour.boundingRect();
              const { width: w2, height: h2 } = rect2;
              if (w2 > 1130 && h2 > 280) {
                // Create a directory for the cropped images if it doesn't exist
                const croppedDir = path.join(process.cwd(), 'croppedImage');
                if (!fs.existsSync(croppedDir)) {
                  fs.mkdirSync(croppedDir, { recursive: true });
                }

                // Crop the image
                const croppedRoi2 = croppedRoi.getRegion(rect2);

                // Save the cropped image
                const croppedFileName = `cropped_page${pageNum}_contour${index}_${id}.png`;
                const croppedPath = path.join(croppedDir, croppedFileName);
                await cv.imwriteAsync(croppedPath, croppedRoi2);

                console.log(`Saved cropped image: ${croppedFileName}`);
              }
            }
          } else {
            // Save the original cropped image if rows <= 310
            const croppedFileName = `cropped_page${pageNum}_contour${index}.png`;
            const croppedPath = path.join(croppedDir, croppedFileName);
            await cv.imwriteAsync(croppedPath, roi);

            console.log(`Saved cropped image: ${croppedFileName}`);
          }
        }
      }

      // Remove the original converted image to save space
      fs.unlinkSync(imagePath);
    }

    console.log('PDF processing and image cropping completed.');
  }

  async cropKanji(): Promise<string[]> {
    const inputDir = path.join(process.cwd(), 'croppedImage');
    const outputDir = path.join(process.cwd(), 'croppedSmallImage');
    const imageFiles = fs
      .readdirSync(inputDir)
      .filter((file) => file.endsWith('.jpg') || file.endsWith('.png'));
    const extractedTexts: string[] = [];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const fileName of imageFiles) {
      const imagePath = path.join(inputDir, fileName);

      if (fs.existsSync(imagePath)) {
        const image = await cv.imreadAsync(imagePath);

        // Crop the image
        const roi = image.getRegion(new cv.Rect(70, 0, 146, 208));

        const croppedFileName = `cropped_${fileName}_kanji.jpg`;
        const outputPath = path.join(outputDir, croppedFileName);
        await cv.imwriteAsync(outputPath, roi);

        // Perform OCR on the cropped image
        const config = {
          lang: 'vie+jpn',
          oem: 1,
          psm: 6,
        };

        try {
          const text = await tesseract.recognize(outputPath, config);
          const parts = text.trim().split('\n');
          const lastTwoParts = parts.slice(-2);
          const result = lastTwoParts.join(':');
          extractedTexts.push(result);
        } catch (error) {
          console.error(
            `Error extracting text from ${croppedFileName}:`,
            error,
          );
        }
      } else {
        console.log(`File ${fileName} not found in ${inputDir}`);
      }
    }

    return extractedTexts;
  }

  async handleReadTextFromImage() {
    try {
      // Fetch all image file entities
      const imageFiles = await this.imageFileService.findAll(
        ImageFileType.TAP_1,
      );

      let allPagesText = [];

      // Ensure the temp directory exists
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Loop through each image file
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        console.log(`Processing image ${imageFile.filename}`);

        // Create a temporary file to store the image data
        const tempImagePath = path.join(tempDir, imageFile.filename);
        fs.writeFileSync(tempImagePath, imageFile.data);

        // Perform OCR on the image
        const config = {
          lang: 'vie+jpn',
          oem: 1,
          psm: 12,
        };

        const text = await tesseract.recognize(tempImagePath, config);

        allPagesText.push({
          page: imageFile.page,
          text: text.trim(),
        });

        // Remove the temporary file
        fs.unlinkSync(tempImagePath);

        console.log(`Extracted text from ${imageFile.filename}`);
      }

      return allPagesText;
    } catch (error) {
      console.error('Error processing images:', error);
      throw new Error('Failed to process images: ' + error.message);
    }
  }

  create(createKanjiDto: Partial<Kanji>) {
    const kanji = this.kanjiRepository.create(createKanjiDto);
    return this.kanjiRepository.save(kanji);
  }

  findAll() {
    return this.kanjiRepository.find();
  }

  findOne(id: number) {
    return this.kanjiRepository.findOneBy({ id });
  }

  async update(id: number, updateKanjiDto: Partial<Kanji>) {
    await this.kanjiRepository.update(id, updateKanjiDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const kanji = await this.findOne(id);
    return this.kanjiRepository.remove(kanji);
  }
}
