import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class KakaoService {
	private readonly logger = new Logger("KakaoService");

	private readonly baseInfoUrl = "https://kapi.kakao.com/v2/user/me";

	constructor(
		private readonly httpService: HttpService
	) { }

	public async getUserInfo(token: string) {
		this.logger.debug(`[KAKAO] ${token}`);

		const requestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
			}
		};
		// const res = await this.httpService
		// 	.get(`${this.baseInfoUrl}`, requestConfig)
		// 	.toPromise();
		// this.logger.debug(JSON.stringify(res));
		// return res;

		return await lastValueFrom(
			this.httpService.get(`${this.baseInfoUrl}`, requestConfig)
				.pipe(map(data => {
					this.logger.debug(data.data);
					return {
						snsId: data.data.id,
						name: data.data.name,
						snsType: "KAKAO"
					};
				}))
				.pipe(
					catchError((e) => {
						this.logger.debug(JSON.stringify(e.response.data));
						const errData = {
							error: true,
							data: e.response.data
						};
						return [errData];
						// throw new ForbiddenException('API not available');
					}),
				)
		);
	};
}