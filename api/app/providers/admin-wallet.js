import {HttpNotFoundError} from '../helpers/errors';
import AdminWallet from '../models/admin-wallet';
import sessionProvider from './session';
import mongoose from 'mongoose';
import userActionProvider from '../providers/user-action';
import config from '../config';


class AdminWalletProvider {
    
  async byPrimaryKey(_id) {
    const user = await AdminWallet.findOne({_id});
    if (!user) {
      throw new HttpNotFoundError();
    }
    return user;
  }

  async byAddr({addr}) {
    return await AdminWallet.findOne({addr: addr});
  }

  async login(body) {
    const user = await this.byAddr(body);

    if (!user) {
      return;
    }

    return user;
  };

}

export default new AdminWalletProvider();
