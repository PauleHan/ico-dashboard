import mongoose from "../db";
import uniqueValidator from "mongoose-unique-validator";
import {DB_MODEL_ADMIN_WALLET} from '../constants';

export const AdminWalletSchema = new mongoose.Schema({
  publicKey: {
    type: String,
    required: true,
  },
  addr: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  fullName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  updatedAt: Date
});

AdminWalletSchema.pre('save', async function(next) {
  const user = this;
  user.updatedAt = Date.now;

  return next();
});

AdminWalletSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    return {
      _id: ret._id,
      publicKey: ret.publicKey,
      addr: ret.addr,
      fullName: ret.fullName,
      type: ret.type
    };
  }
});


export default mongoose.db.model(DB_MODEL_ADMIN_WALLET, AdminWalletSchema);
