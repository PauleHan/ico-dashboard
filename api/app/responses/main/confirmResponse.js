import {baseResponse, RESPONSE_SUCCESS} from '../baseResponse';
import baseError from '../baseError';

export default function (data) {
	let result;
	let base = baseResponse;

	if (data.err) {
		let errorsData = baseError(data.err);
		result = data.res.status(errorsData.status).json(errorsData.errors);
	} else {
		result = data.res.status(RESPONSE_SUCCESS).json(base);
	}

	return result;
}