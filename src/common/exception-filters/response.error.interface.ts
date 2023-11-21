export interface IResponseError {
  statusCode: number;
  message: string;
  errorData: {
    code: string;
    timestamp: string;
    path: string;
    method: string;
    body: object | string;
  }
}