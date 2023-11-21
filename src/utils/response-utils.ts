import { IDetailResponse } from "./response.interface";
import { HttpException, HttpStatus } from '@nestjs/common';

export function SuccessResponse(data: Object): IDetailResponse {
    return {
        message: "success",
        data: data
    };
}

export function BadRequestResponse(message): HttpException {
    throw new HttpException({ message }, HttpStatus.BAD_REQUEST);
}