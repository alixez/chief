/**
 * Created by 罗成 on 2017/5/8.
 */
import mongoose from 'mongoose';
import {listGenerator} from '../../utils/tools';
const News = mongoose.model('News');
export default async function(req, {isLogin, user}) {

  if (!isLogin) {
    return (res) => {
      res.redirect('/auth/admin');
    }
  }
  let error = {};
  if (req.session.error) {
    error = req.session.error;
  }

  // const list = await News.find({}).populate('author');
  const list = await listGenerator(req, 'News', null, { populate: 'author'});

  return (res) => {
    res.render('houtai/houtai', {
      user: user,
      newsList: list.data,
      ...error,
    });
  }
}