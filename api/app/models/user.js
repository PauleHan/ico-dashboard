import bcrypt from "bcryptjs";
import mongoose from "../db";
import {isEmail} from "validator";
import uniqueValidator from "mongoose-unique-validator";
import {DB_MODEL_USER} from '../constants';


const SALT_WORK_FACTOR = 11;
export const encryptPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return reject(err);
    }
    bcrypt.hash(password, salt, (errHash, hash) => {
      if (errHash) {
        return reject(errHash);
      }
      resolve(hash);
    });
  });
});

export const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  token: String,
  wallet: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  lastAttemptAt: Date,
  loggedInAt: Date,
  confirmed: {
    type: Number,
    default: 0
  }
});

UserSchema.pre('save', async function(next) {
  const user = this;
  user.updatedAt = Date.now;
  if (user.isModified('password')) {
    user.password = await encryptPassword(user.password);
  }

  return next();
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    return {
      _id: ret._id,
      confirmed: ret.confirmed,
      email: ret.email,
      wallet: ret.wallet,
      full_name: ret.full_name
    };
  }
});


UserSchema.plugin(uniqueValidator, {message: 'This email already in use.'});

UserSchema.path('email').validate(function (email) {
   return isEmail(email); // Assuming email has a text attribute
}, 'Sorry, wrong email format.')

export default mongoose.db.model(DB_MODEL_USER, UserSchema);
