import {BaseController} from './base.controller';
import errorHandler from '../middleware/errorHandler';
import response from '../middleware/response';
import UserHelper from "../helpers/user";
import confirmResponse from '../responses/main/confirmResponse';
import RegisterResponse from '../responses/auth/RegisterResponse';
import request from 'request';
import appConfig from '../config/constants';
import {validateFields} from '../helpers/validate';

import config from '../config';
import mail from '../helpers/mail';
import userActionProvider from '../providers/user-action';
import userProvider from '../providers/user';
import ContactUs from '../models/contactus';

class MainController extends BaseController {

	contactUsWhiteList = [
		'name',
		'email',
		'message'
	];

	registerWhiteList = [
		'full_name',
		'email',
		'password',
		'password_repeat',
                'wallet'
	];

	updateWhiteList = [
		'wallet'
	];

	contactus = async (req, res, next) => {
		try {
			const params = this.filterParams(req.body, this.contactUsWhiteList);
			let model = new ContactUs({
				...params
			});
			const result = await model.save();
			//this.addToMailchimp(req.body.email,req.body.name);
			//const mail = await mailing().sendContactUsMail(params);
			return response(req, res, result);
		} catch (err) {
			return errorHandler(err, req, res, next);
		}
	};

	index = async (req, res) => {
		res.json({
			version: '0.0.1',
		});
	};

	getUser = async (req, res, next) => {
		try {
			return res.json(await req.currentUser.toJSON());
		} catch (err) {
			errorHandler(err, req, res, next);
		}
	};

        register = async (req, res, next) => {
            let validationErrors = await validateFields(req, res, next);
     
            if (Object.keys(validationErrors).length > 0) {
                return res.status(422).json({errors: validationErrors});
            }
            
            try {
                const params = this.filterParams(req.body, this.registerWhiteList);
                const user = await UserHelper.createUser({...params});
                const action = await userActionProvider.generateConfirmEmailActionRecord(user._id);
                mail.sendRegistrationEmail({
                    url: `${config.url}/confirm.html?action=${action._id}&data=${action.data && action.data.hash}`,
                    email: user.email,
                    name: user.full_name,
                    language: 'en',
                });
                res.json({user});
            } catch (err) {
                errorHandler(err, req, res, next);
            }
        };
	
	setWallet = async (req, res, next) => {
           try {
           	const params = this.filterParams(req.body, this.updateWhiteList);
                let user = await userProvider.updateWallet({
                    identifier:req.currentUser._id, 
                    wallet:params.wallet
                });
                
                user.token = req.currentUser.token;
                
           	return res.json(user);
           } catch (err) {
           	errorHandler(err, req, res, next);
           }
	};


	subscribe = async (req, res, next) => {
		try {
			let model = new Contactus({
				email: req.body.email
			}, {skip: ['name', 'message']});
			await model.save();

			//mailing().sendSubscribeEmail(req.body);
			return response(req, res, {});
		} catch (err) {
			return errorHandler(err, req, res, next);
		}
	};

    reset = async (req, res, next) => {
        try {
            const id = req.param('id');
            const data = req.param('data');
            if (id && data) {
                const password = req.body.password;
		const password_repeat = req.body.password_repeat;
                let err = {};
                
                if (!req.body.password) {
                    Object.assign(err, {'password': 'Password cannot be blank'});
                }
                
                if (req.body.password && req.body.password.length < 6) {
                    Object.assign(err, {'password': 'Min password length are 6 characters'});
                }
                
                if (req.body.password !== req.body.password_repeat) {
                    Object.assign(err, {'password_repeat': 'Password mismatch'});
                }
                
                if (Object.keys(err).length > 0) {
                    return res.status(422).json({errors: err});
                }
                        
                const result = await userActionProvider.updateUserPassword(req.body);
                return res.json(result);
            } else {
                const user = await userProvider.byEmail(req.body);
                if (user && user.confirmed) {
                    const action = await userActionProvider.generateResetActionRecord(user._id);

                    mail.sendResetPasswordEmail({
                        url: `${config.url}/reset.html?id=${action._id}&code=${action.data && action.data.hash}`,
                        email: user.email,
                        name: user.full_name,
                        language: 'en',
                    });

                    return response(req, res, {});
                }
            }
            return next(new HttpUnprocessableEntityError());
        } catch (e) {
            return next(e);
        }
    };

	confirm = async (req, res, next) => {
                try {
                    if (req.user && req.user.confirmed && req.user.confirmed.email) {
                        return success(res, req.user);
                    }
                    const result = await userActionProvider.emailVerify({
                        id: req.params.action,
                        data: req.params.data
                    });
                    res.json(result);
                } catch (e) {
                    return next(e);
                }
	};	
        
        resend = async (req, res, next) => {
            try {
                const user = await userProvider.byPrimaryKey(req.params.user_id);
                let action = await userActionProvider.getEmailActionRecord({user: user});
                if (!action) {
                    action = await userActionProvider.generateConfirmEmailActionRecord(user._id);
                }
                
                mail.sendRegistrationEmail({
                    url: `${config.url}/confirm.html?action=${action._id}&data=${action.data && action.data.hash}`,
                    email: user.email,
                    name: user.full_name,
                    language: 'en',
                });
                
                res.json({user});
            } catch (e) {
                return next(e);
            }
        }
        ;


	sendGFormTest = (req) => {
		try {
			//old test google form (modultraid)
			request.post('https://docs.google.com/forms/d/e/1FAIpQLSetgWw-jdtcnPt6327tV14-mrnzGEiW47fN4iUtcJPhSeiKXA/formResponse', {
				form: {
					'entry.282765473': req.email ? req.email : '',
					'entry.1916199099': req.utm_source ? req.utm_source : '',
					'entry.1600229878': req.utm_medium ? req.utm_medium : '',
					'entry.595357331': req.utm_campaign ? req.utm_campaign : '',
					'entry.1447209678': req.utm_content ? req.utm_content : '',
					'entry.1560038263': req.utm_term ? req.utm_term : '',
					'entry.1560038263': req.reflink ? req.reflink : ''
				}
			});
		} catch (e) {
			console.log(e);
		}
	};

	addToMailchimp = (email, name) => {
		try {
			let dataCenter = appConfig.mailChimp.apiKey.split('-')[1];
			request({
				url: `https://${dataCenter}.api.mailchimp.com/3.0/lists/${appConfig.mailChimp.listId}/members`,
				json: {
					'email_address': email,
					'status': 'subscribed',
					'merge_fields': {
						'FNAME': name,
					}
				},
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `apikey ${appConfig.mailChimp.apiKey}`
				}
			}, function (error, response, body) {
				if (error) {
					console.log('error ',error);
					return;
				}
			});
		} catch (e) {
			console.log('Exception ',e);
		}
	}

}

export default new MainController();
