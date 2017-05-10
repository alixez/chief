/**
 * Created by 罗成 on 2017/5/8.
 */

import mongoose from 'mongoose';

const User = mongoose.model('User');
export default async function(req, {isLogin}) {

  const {action} = req.query;
  if (action === 'login') {
    if (isLogin) {
      return res => {
        res.redirect('/admin/home');
      }
    }
    const {username, password} = req.body;
    const foundUser = await User.findOne({
      username,
      password,
    });
    return res => {
      if (foundUser) {
        // 登录成功后将用户信息存入session,记录登录状态
        foundUser.password = undefined;
        req.session.user = foundUser;
        // 登录成功重定向
        res.redirect('/admin/home');
      } else {
        res.render('login/guanliyuan', {
          code: -1000,
          message: '用户名或者密码错误',
        });
      }
    };
  }

  return (res) => {
    res.render('login/guanliyuan');
  }
}