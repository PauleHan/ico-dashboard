import {BaseController}  from './base.controller';
import AdminWalletProvider from '../providers/admin-wallet';
import LoginResponse from '../responses/auth/LoginResponse';
import sessionProvider from '../providers/session';
import {encrypt} from '../helpers/ecies.factory';
import ApisProvider from '../providers/apis';
import {
  CURRENCY_ETH,
  CURRENCY_USD
} from '../constants';

class AdminController extends BaseController {
    
    getConversionRate = async (req, res, next) => {
        try {
            let conversion = await ApisProvider.getExchangeRate(CURRENCY_ETH, CURRENCY_USD);
            return res.status(200).json(conversion);
        } catch (e) {
            return next(e);
        }
    };
    
    login = async (req, res, next) => {
        try {
            const adminLoginData = await AdminWalletProvider.login(req.body);
            // generate token
            if (adminLoginData != null) {                
                const session = await sessionProvider.create(adminLoginData._id);
                const {fullName, addr, publicKey, type, _id} = adminLoginData;
                return encrypt(publicKey, session.token).then((check)=>{
                    const userRequest = {fullName, check, addr, publicKey, type, _id};
                    return res.status(200).json(userRequest);
                });
            } else {
                res.status(422).json({error: true});
            }
            return adminLoginData;
        } catch (e) {
            return next(e);
        }
    };
}

export default new AdminController();
