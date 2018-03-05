import Constants from "../config/constants";
import {RESPONSE_INTERNAL_ERROR, RESPONSE_INVALID_INPUT} from './baseResponse';

let parseValidationErrors = (err) => {
	let errors = null;
	if (err.errors) {
		const {errors} = err;
		for (const type in errors) {
			if (type in errors) {
				errors[errors[type].path] = errors[type].message;
			}
		}
	}else errors = err;
	return errors;
};

export default function (err, req, res, next) {
	
	let response = {};

	response.message = err.message || 'Internal Server Error.';

	if (Constants.envs.development) {
		response.stack = err.stack;
	}

	response.errors = parseValidationErrors(err);
	response.status = response.errors ? RESPONSE_INVALID_INPUT : RESPONSE_INTERNAL_ERROR;

	return response;
}

