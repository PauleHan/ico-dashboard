import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';
import SessionProvider from "../providers/session";

const {sessionSecret} = Constants.security;
const BEARER = 'Bearer';

export const headerToken = (headers) => {
    if (headers && headers.authorization) {
        const [key, token] = String(headers.authorization).split(' ');
        return (key === BEARER) ? token : key;
    }

    return null;
};

export default async function authenticate(req, res, next) {
    const {authorization} = req.headers;
    req.accessToken = headerToken(req.headers);

    if (req.accessToken) {
        try {
            const session = await SessionProvider.byToken(req.accessToken);
            if (!session) {
                return res.sendStatus(401);
            }
            req.currentUser = session.user;
            req.currentUser.token = session.token;
            next();
        } catch (err) {
            console.log(err)
            next(err);
        }
    }
}
