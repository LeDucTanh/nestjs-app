FROM node:18 AS development

# Install GraphicsMagick and Tesseract OCR
RUN apt-get update && apt-get install -y graphicsmagick tesseract-ocr tesseract-ocr-vie tesseract-ocr-jpn

WORKDIR /app

RUN npm i -g @nestjs/cli@9.0.0