import dotenv from 'dotenv';

const env = dotenv.config().parsed;
const blank = 'check_config';

export default {
	MAIL_HOST: env.MAIL_HOST || blank,
	MAIL_PORT: env.MAIL_PORT || blank,
	MAIL_LOGIN: env.MAIL_LOGIN || blank,
	MAIL_PASS: env.MAIL_PASS || blank,
	MAIL_CONTACT: env.MAIL_CONTACT || blank,

	HOST_NAME: env.HOST_NAME || blank,
};