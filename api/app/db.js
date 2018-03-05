import mongoose from 'mongoose';
import config from './config';

const defaultOptions = {};

const {uri, user, pass, options} = config.db;

mongoose.Promise = Promise;

mongoose.db = mongoose.createConnection(uri, {...defaultOptions, ...options, user, pass});

export default mongoose;
