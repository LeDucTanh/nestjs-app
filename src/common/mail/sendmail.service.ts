import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Injectable()
export class SendMailService {
	private readonly logger = new Logger("SendMailService");
	private transporter;

	constructor(private configSvc: ConfigService) {
		this.transporter = createTransport(configSvc.get("smtp"));
	}

	private async _sendEmail(
		to: string,
		subject: string,
		html: string | any,
		attachments?: any[],
	) {
		return new Promise((resolve, reject) => {
			this.logger.debug("call function sendEmail");
			const options: any = {
				from: this.configSvc.get("smtp").auth.user,
				to: to,
				subject: subject,
				html: html,
			};

			if (attachments) {
				Object.assign(options, { attachments: attachments });
			}
			this.transporter.sendMail(options, (error: any, info: any) => {
				if (error) {
					this.logger.error(error);
					resolve(error);
				} else {
					this.logger.debug(info.response)
					resolve(info.response);
				}
			});
		});
	};

	async sendEmailOtpSignup(to) {
		return await this._sendEmail(
			to,
			"Subject",
			"OK"
		);
	}
}


