import { HttpNotFoundError } from '../helpers/errors';
import Session from '../models/session';
import User from '../models/user';

class SessionProvider {
  async byToken(token) {
    const session = await Session.findOne({token}).populate('user');
    if (!session) {
      throw new HttpNotFoundError();
    }
    return session;
  }

  async create(user) {
    const session = new Session({
      user
    });
    await session.save();
    return session;
  }

  async remove(token){
    return await Session.remove({token});
  }
}

export default new SessionProvider();
