import {HttpNotFoundError} from '../helpers/errors';
import UserAction from '../models/user-action';
import {USER_ACTION_CONFIRM_EMAIL, USER_ACTION_OTP, USER_ACTION_RESET_PASSWORD} from '../constants';
import crypto from 'crypto';
import sessionProvider from './session';

const CODE_LENGTH = 96;

class UserActionProvider {
  async getOtpActionRecord(req) {
    return await UserAction.findOne({actionType: USER_ACTION_OTP, user: req.user && req.user._id});
  }
  
  async getEmailActionRecord(req) {
    return await UserAction.findOne({actionType: USER_ACTION_CONFIRM_EMAIL, user: req.user && req.user._id});
  }

  async generateOtpActionRecord(user, data) {
    await UserAction.deleteMany({user, actionType: USER_ACTION_OTP});
    return await this._generateAction(user, USER_ACTION_OTP, data);
  }

  async generateResetActionRecord(user) {
    await UserAction.deleteMany({user, actionType: USER_ACTION_RESET_PASSWORD});
    return await this._generateAction(user, USER_ACTION_RESET_PASSWORD);
  }

  async updateUserPassword({id, data, password}) {
    const userAction = await UserAction.findOne({_id: id}).populate('user');
    if (userAction && userAction.data.hash === data && parseInt(userAction.actionType) === USER_ACTION_RESET_PASSWORD) {
      if (password) {
        const user = await userAction.user[0];
        user.password = password;
        await user.save();
        userAction.remove();
        
        const session = await sessionProvider.create(user._id);
        
        return {
            token: session.token,
            user
        };
      }
    }
    throw new HttpNotFoundError();
  }

  async generateConfirmEmailActionRecord(user) {
    return await this._generateAction(user, USER_ACTION_CONFIRM_EMAIL);
  }

  async _generateAction(user, actionType, data) {
    const userAction = new UserAction({
      user,
      data: data || {hash: await crypto.randomBytes(CODE_LENGTH).toString('hex')},
      actionType,
    });
    await userAction.save();
    return userAction;
  }

  async emailVerify({id, data}) {
    const userAction = await UserAction.findOne({_id: id}).populate('user');
    if (userAction && userAction.data && userAction.data.hash === data && parseInt(userAction.actionType) === USER_ACTION_CONFIRM_EMAIL) {
      const user = userAction.user[0];
      user.confirmed = true;
      await user.save();
      await userAction.remove();
      
      const session = await sessionProvider.create(user._id);
      
      return {
          token: session.token,
          user
      };
    } else {
      throw new HttpNotFoundError();
    }
  }
}

export default new UserActionProvider();
