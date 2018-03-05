/**
 * @typedef {Model} Session
 * @property {String} token
 * @property {String} deviceType
 */
import mongoose from '../db';
import crypto from 'crypto';
import {DB_MODEL_SESSION, DB_MODEL_USER} from '../constants';

export const SessionSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DB_MODEL_USER,
  },
});

SessionSchema.pre('save', async function(next) {
  const session = this;
  session.token = await crypto.randomBytes(64).toString('hex');
  return next();
});

export default mongoose.db.model(DB_MODEL_SESSION, SessionSchema);
