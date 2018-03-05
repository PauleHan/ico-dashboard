import config from '../helpers/config';

export default {
	transport: {
		host: config.MAIL_HOST,
		port: config.MAIL_PORT,
		secure: true, // use SSL
		auth: {
			user: config.MAIL_LOGIN,
			pass: config.MAIL_PASS,
		}
	},
	contact: {
		from:config.MAIL_LOGIN,
		to: config.MAIL_CONTACT
	},
};
