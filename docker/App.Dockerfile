FROM node:20 AS development

# Install GraphicsMagick, Tesseract OCR, and OpenCV
RUN apt-get update && apt-get install -y graphicsmagick tesseract-ocr tesseract-ocr-vie tesseract-ocr-jpn libopencv-dev build-essential cmake

# Set environment variable for opencv4nodejs
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_INCLUDE_DIR=/usr/include/opencv4
ENV OPENCV_LIB_DIR=/usr/lib/aarch64-linux-gnu
# ENV OPENCV_LIB_DIR=/usr/lib/x86_64-linux-gnu

WORKDIR /app

RUN npm i -g @nestjs/cli@9.0.0