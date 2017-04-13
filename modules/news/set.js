import mongoose from 'mongoose';

const News = mongoose.model('News');

export default async function (req) {
  const {title, body} = req.query; // 获取get请求提交的参数 如果获取post过来的需要再body里面取 req.body;

  const data = {
    title,
    body,
  };

  const lastCreatedNews = await News.create(data);

  return {
    message: '创建成功',
    code: 1000,
  };

}