import {baseResponse, RESPONSE_SUCCESS} from '../baseResponse';
import baseError from '../baseError';

export default function (data) {
	let result;

	if (data.err) {
		let errorsData = baseError(data.err);
		result = data.res.status(errorsData.status).json(Object.assign(baseResponse,{errors:errorsData.errors}));
	} else {
		console.log(data);
		result = data.res.status(RESPONSE_SUCCESS).json(Object.assign(baseResponse,data.result));
	}

	return result;
}