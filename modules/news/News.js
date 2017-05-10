/**
 * Created by alixez on 17-5-10.
 */
import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;
const NewsSchema = mongoose.Schema({
  title: {type: String},
  category: {type: String},
  content: {type: String},
  author: {type: ObjectId, ref: 'User'},
  create_at: {type: Date, default: Date.now}
});

export default mongoose.model('News', NewsSchema);