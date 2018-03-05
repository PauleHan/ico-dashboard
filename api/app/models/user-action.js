/**
 * @typedef {Model} Session
 * @property {String} token
 * @property {String} deviceType
 */
import mongoose from '../db';
import {
  DB_MODEL_USER,
  DB_MODEL_USER_ACTION,
  USER_ACTION_CONFIRM_EMAIL,
  USER_ACTION_NOACTION,
  USER_ACTION_RESET_PASSWORD,
  USER_ACTION_OTP
} from '../constants';

export const UserAction = new mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_MODEL_USER,
    }],
  data: {
    type: Object,
  },
  actionType: {
    type: String,
    enum: [
      USER_ACTION_NOACTION,
      USER_ACTION_CONFIRM_EMAIL,
      USER_ACTION_RESET_PASSWORD,
      USER_ACTION_OTP
    ],
    default: USER_ACTION_NOACTION,
  },
});

export default mongoose.db.model(DB_MODEL_USER_ACTION, UserAction);