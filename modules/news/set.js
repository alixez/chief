import mongoose from 'mongoose';

const News = mongoose.model('News');

export default async function (req) {
  const {title, body, ...others} = req.query; // 获取get请求提交的参数 如果获取post过来的需要再body里面取 req.body;
  console.log(others);
  console.log(req.query);
  const data = {
    title,
    body,
  };


  console.log(test2);

  // const lastCreatedNews = await News.create(data);

  const NewsModel1 = new News(data);
  await NewsModel1.save();

  const NewsModel2 = new News();
  NewsModel2.title = title;
  NewsModel2.body = body;
  await NewsModel2.save();

  return {
    message: '创建成功',
    code: 1000,
  };

}