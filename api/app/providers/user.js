import {HttpNotFoundError} from '../helpers/errors';
import User from '../models/user';
import sessionProvider from './session';
import mongoose from 'mongoose';
import userActionProvider from '../providers/user-action';
import config from '../config';

import {
  VI_ACCEPTED_EXPIRE,
  VI_ACCREDITED,
  VI_DECLINED_BY_INVESTOR,
  VI_DECLINED_EXPIRE,
  VI_NOT_ACCREDITED,
} from '../constants';

class UserProvider {
  async byPrimaryKey(_id) {
    const user = await User.findOne({_id});
    if (!user) {
      throw new HttpNotFoundError();
    }
    return user;
  }

  async updateVerificationStatus(user, status) {
    user.verifyInvestor.status = status.verification_request_step;
    const statusResult = status.verification_request_step;
    if (statusResult === VI_ACCREDITED) {
      user.verifyInvestor.needVerify = false;
      user.confirmed.verifyInvestor = true;
    }
    if (statusResult === VI_ACCEPTED_EXPIRE ||
      statusResult === VI_DECLINED_EXPIRE ||
      statusResult === VI_DECLINED_BY_INVESTOR ||
      statusResult === VI_NOT_ACCREDITED
    ) {
      user.verifyInvestor.needVerify = false;
      //TODO disable user
    }
    await user.save();
  }

  async updateVerificationData({identifier, vi_user_id}, request = null) {
    const user = await this.byIdentifier({identifier});
    if (user !== null) {
      user.verifyInvestor.verifyInvestorId = vi_user_id;
      await user.save();
    }

    if (request !== null) {
      //console.log('==========', user, '-------', request);
      user.verifyInvestor.needVerify = true;
      user.verifyInvestor.verificationRequestData = request.id;
      user.verifyInvestor.verificationRequestData = JSON.stringify(request);
      await user.save();
    }

    return user;
  }

  async findVIVerification() {
    return await User.find({'verifyInvestor.needVerify': true});
  }

  async byEmail({email}) {
    return await User.findOne({email: email.toLowerCase()});
  }

  async byIdentifier({identifier}) { 
    return await User.findOne({_id: mongoose.Types.ObjectId(identifier)});
  }

  async login(body) {
    const user = await this.byEmail(body);

    if (!user || !user.checkPassword(body.password)) {
      return;
    }
    
    if (!user.confirmed) {
        return {
          err: "You haven't confirmed your email. Please check your mail box to find the link.",
          url: `${config.url}/confirm.html?resend=${user._id}`
        };
    }
    
    const session = await sessionProvider.create(user._id);

    return {
      token: session.token,
      user,
    };
  };
  
  async updateWallet({identifier, wallet}) {
    const user = await this.byIdentifier({identifier});
    if (user !== null) {
      user.wallet = wallet;
      await user.save();
    }
    return user.toJSON();
  }

}

export default new UserProvider();
