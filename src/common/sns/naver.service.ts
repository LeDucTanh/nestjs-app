import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverService {
	private readonly logger = new Logger("NaverService");

	private readonly baseInfoUrl = "https://openapi.naver.com/v1/nid/me";
	//private readonly baseInfoUrl = "https://apis.naver.com/nidlogin/nid/getUserProfile";

	constructor(
		private readonly httpService: HttpService,
		private readonly confSvc: ConfigService
	) { }

	public async getUserInfo(token: string) {
		const state = 'RAMDOM_STATE';
		const config = this.confSvc.get('sns.naver');

		const requestConfig = {
			headers: {
				Authorization: `Bearer ${token}`,
				'X-Naver-Client-Id': config.client_id,
				'X-Naver-Client-Secret': config.client_secret
			}
		};
		//const redirectURI = "http://localhost";
		//const url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectURI}&code=${token}&state=${state}`;

		return await lastValueFrom(
			this.httpService.get(`${this.baseInfoUrl}`, requestConfig)
				.pipe(map(data => {
					this.logger.debug(data.data);
					return {
						snsId: data.data.response.id,
						name: data.data.name,
						snsType: "NAVER"
					};
				}))
				.pipe(
					catchError((e) => {
						console.log(e.response.data);
						const errData = {
							error: true,
							data: e.response.data
						}
						return [errData];
						// throw new ForbiddenException('API not available');
					}),
				)
		);
	};
}