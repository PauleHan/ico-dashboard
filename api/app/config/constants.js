import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
	env: process.env.NODE_ENV,
	get envs() {
		return {
			test: process.env.NODE_ENV === 'test',
			development: process.env.NODE_ENV === 'development',
			production: process.env.NODE_ENV === 'production',
		};
	},

	version: require('../../package.json').version,
	root: path.normalize(__dirname + '/../../..'),
	port: process.env.PORT || 4244,
	ip: process.env.IP || '0.0.0.0',
	apiPrefix: '/api', // Could be /api/resource or /api/v2/resource
	userRoles: ['guest', 'user', 'admin'],

	/**
	 * Security configuation options regarding sessions, authentication and hashing
	 */
	security: {
		sessionSecret: process.env.SESSION_SECRET || 'i-am-the-secret-key',
		sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
		saltRounds: process.env.SALT_ROUNDS || 12,
	},

	mailChimp: {
		apiKey: process.env.MAIL_CHIMP_KEY,
		listId: process.env.MAIL_CHIMP_LISTID
	},
        google: {
            key: process.env.GOOGLE_API_KEY,
            recaptcha: {
                privateKey: process.env.GOOGLE_RECAPTCHA_PRIVATE_KEY,
                publicKey: process.env.GOOGLE_RECAPTCHA_PUBLIC_KEY
            },
        }
};

// Recursively merge configurations
export default merge(defaultConfig, {});
