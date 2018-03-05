import User from '../models/user'
import UserAction from '../models/user-action';
import mailing from '../helpers/mail';
import urlBuilder from 'build-url';
import config from '../helpers/config';
import constants from '../config/constants';
import {CONFIRMATION_ACTION_REGISTER, CONFIRMATION_ACTION_RESET} from '../constants';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const createUser = async (params) => {
	let userModel = new User({
		...params
	});
	await userModel.save();
        
	return await userModel.toJSON();
};

export const updateUser = async (user, params) => {
	let userModel = await User.findOne({
		where: {id: user.id}
	});
	await userModel.update(Object.assign({}, userModel, {...params}));
	await userModel.save();
	
	return await userModel.toJSON();
};

export const findOne = async (user) => {
	let userModel = await User.findOne({
		where: {id: user.id}
	});
	return await userModel.toJSON();
};

export const findAll = async () => {
	let usersModel = await User.findAll();
	return await usersModel;
};

export const findReferrals = async (user) => {
	let result = await User.findAndCountAll({
		where: {referral: user.id}
	});
	return result;
};

export const confirmUserRegistration = async (params) => {
	UserAction.findOne({
		where: {
			id: params.id,
			used: false,
			type: CONFIRMATION_ACTION_REGISTER
		},
	}).then((confirmation) => {
		if (confirmation) {
			confirmation.getUser().then(async (user) => {
				await user.update(Object.assign({}, user, {active: true}));
				await confirmation.update(Object.assign({}, confirmation, {used: true}));
			});
		}
	});
};

export const requestUserPasswordReset = async (params) => {
	const user = await User.findOne({
		where: {email: params.email}
	});
	if (user) {
		await UserAction.update({used: true}, {
			where: {
				used: false,
				user_id: user.id
			}
		});
		const confirmationModel = new UserConfirmation();
		confirmationModel.user_id = user.id;
		confirmationModel.code = crypto.randomBytes(32).toString('hex');
		confirmationModel.type = CONFIRMATION_ACTION_RESET;
		await confirmationModel.save();
		await mailing().sendResetPasswordEmail({
			url: urlBuilder(config.HOST_NAME, {
				path: 'reset.html',
				queryParams: {
					id: confirmationModel.id,
					code: confirmationModel.code
				}
			}),
			email: user.email
		});
	} else {
	    //throw user email not exist error
	}
};

export const confirmUserPasswordReset = async (params) => {
	const confirmationModel = await UserConfirmation.findOne({
		where: {
			id: params.id,
			code: params.code,
			type: CONFIRMATION_ACTION_RESET,
			used: false
		}
	});
	if (params.password !== params.password_repeat) {
	    //throw password missmatch not exist error
	}
	if (confirmationModel) {
		const userModel = await confirmationModel.getUser();
		if(userModel) {
			await userModel.validate({fields:['password']});
			await userModel.updateAttributes({password: params.password});
			await confirmationModel.updateAttributes({used: true});
		}
		return userModel;
	} else {
	    //throw link is invalid not exist error
	}
};


export default {
    createUser,
    confirmUserRegistration,
    requestUserPasswordReset,
    confirmUserPasswordReset,
    updateUser,
    findOne,
    findAll,
    findReferrals
};
