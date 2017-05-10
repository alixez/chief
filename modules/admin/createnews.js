/**
 * Created by 罗成 on 2017/5/8.
 */
import mongoose from 'mongoose';

const News = mongoose.model('News');
export default async function(req, {isLogin, user}) {

  if (!isLogin) {
    return (res) => {
      res.redirect('/auth/admin');
    }
  }

  const {title, content, category} = req.body;
  const news = new News();
  news.title = title;
  news.content = content;
  news.category = category;
  news.author = user._id;
  const createdNews = await news.save();

  return (res) => {

    if (createdNews) {
      req.session.error = {
        code: 1000,
        message: '保存成功',
      };
    } else {

      req.session.error = {
        code: -1000,
        message: '保存失败',
      };
    }

    res.redirect('/admin/home');
  }
}