import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appleSignin from 'apple-signin-auth';

@Injectable()
export class AppleService {
	private readonly logger = new Logger("AppleService");

	private readonly baseInfoUrl = "https://appleid.apple.com";

	constructor(
		private readonly httpService: HttpService,
		private readonly configSvc: ConfigService
	) { }

	public async getUserInfo(token: string) {
		try {
			this.logger.debug(`Your APPLE id_token: ${token}`);
			const config = this.configSvc.get("sns.apple");
			this.logger.debug(`Your config ${JSON.stringify(config)}`);
			const {
				client_id,
				client_nonce
			} = this.configSvc.get("sns.apple");
			this.logger.debug(`APPLE INFO: ${client_id}, ${client_nonce}`);
			const resp = await appleSignin.verifyIdToken(token, {
				audience: client_id,
				nonce: client_nonce,
				ignoreExpiration: true,
			});

			const {
				sub: userAppleId,
				aud: clientId,
				exp: expired,
				email
			} = resp;

			this.logger.debug(`Your resp: ${JSON.stringify(resp)}`);

			return {
				snsId: userAppleId,
				snsEmail: email,
				snsType: "APPLE"
			};
		} catch (err) {
			this.logger.error(`Verify APPLE error: ${JSON.stringify(err)}`);
		}
	};
}