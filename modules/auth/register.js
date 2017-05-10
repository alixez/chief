/**
 * Created by 罗成 on 2017/5/9.
 */
import mongoose from 'mongoose';
const User = mongoose.model('User');

export default async function(req) {
  const {action} = req.query;
  if (action === 'signup') {
    const {username, password, email, address} = req.body;
    if (!username || !password) {
      return res => res.render('login/register', {code: -1000, message: '用户名密码必须！'});
    }
    const createdUser = await User.create({
      username,
      password,
      email,
      address,
    });

    return res => res.redirect('/auth/login');
  }

  return (res) => {
    res.render('login/register');
  }
}