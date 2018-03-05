import bcrypt from "bcryptjs";
import mongoose from "../db";
import {isEmail} from "validator";
import uniqueValidator from "mongoose-unique-validator";
import {DB_MODEL_CONTACT_US} from '../constants';

export const ContactUsSchema = new mongoose.Schema({
  id: {
    type: String,
    index: {unique: true},
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


ContactUsSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    return {
      _id: ret._id,
      id: ret.id,
      email: ret.email,
      name: ret.name,
      message: ret.message
    };
  }
});

export default mongoose.db.model(DB_MODEL_CONTACT_US, ContactUsSchema);
