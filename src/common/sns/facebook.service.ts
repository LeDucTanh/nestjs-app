import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class FacebookService {
	private readonly logger = new Logger("FacebookUtil");

	private readonly baseInfoUrl = "https://graph.facebook.com/v9.0/me?fields=id%2Cname%2Cemail&access_token=";

	constructor(
		private readonly httpService: HttpService
	) { }

	public async getUserInfo(token: string) {
		return await lastValueFrom(
			this.httpService.get(`${this.baseInfoUrl}${token}`)
				.pipe(map(data => {
					this.logger.debug(data.data);
					return {
						snsId: data.data.id,
						name: data.data.name,
						snsType: "FACEBOOK"
					};
				}))
				.pipe(
					catchError((e) => {
						const errData = {
							error: true,
							data: e.response.data.error
						};
						return [errData];
						// throw new ForbiddenException('API not available');
					}),
				)
		)
			;
	};
}