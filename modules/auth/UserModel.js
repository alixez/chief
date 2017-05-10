/**
 * Created by 罗成 on 2017/5/9.
 */
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const NewsSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String},
  address: String
});

export default mongoose.model('User', NewsSchema);