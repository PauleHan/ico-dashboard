import {BaseController}  from './base.controller';
import userProvider from '../providers/user';
import LoginResponse from '../responses/auth/LoginResponse';
import {HttpUnprocessableEntityError} from '../helpers/errors';

const MESSAGE_WRONG_LOGIN = 'Email field cannot be blank';
const MESSAGE_WRONG_PASSWORD = 'Password field cannot be blank';
const MESSAGE_WRONG_CREDENTIALS = 'Login and password mismatch our records.';

class AuthController extends BaseController {

    login = async (req, res, next) => {
        const {email, password} = req.body;
        let err = {};
        try {
            if (!email) {
                Object.assign(err, {'email': MESSAGE_WRONG_LOGIN});
            }
            if (!password) {
                Object.assign(err, {'password': MESSAGE_WRONG_PASSWORD});
            }
            if (Object.keys(err).length > 0) {
                return LoginResponse({err: err, res});
            }
            const result = await userProvider.login(req.body);
            if (result && result.err) {
                Object.assign(err, {
                    password: result.err,
                    url : result.url
                });
                return LoginResponse({err: err, res});
            }
            if (result) {
                return LoginResponse({result: {user: result}, res});
            }
            return LoginResponse({err: MESSAGE_WRONG_CREDENTIALS, res});
        } catch (e) {
            return next(e);
        }
    }
    ;
}

export default new AuthController();
