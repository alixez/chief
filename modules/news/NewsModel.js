/**
 * Copyright(c) omk 2016
 * Filename:
 * Author  : alixez
 */
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

// 定义数据表结构 -- 不需要取mongdb数据库里面建立该表， 永远记住一句话， 存在即合理。程序员认为该表存在，它就存在。
// 虽然在这里这样定义了结果，实际的数据库存取你可以存任何字段
// 比如 第一行数据我可一这样存   { title : '123123', body: 'sadfsafasdfasd'}  // 这个和我们定义的结构相同，存取正确
// 第二行 我可以这样存 { title: 'sadfasdfasd', 'body': 'sadfasdfasdf', 'updated_at': 'asdfasdfasdf', 'create_at': '123123123123'} 与我们定义的结构不同，存取依旧正确
// 但是第三行 如果这样存 { title: 'sadfasd', create_at: '123123123' } 在程序里面插入会报错，因为我们程序的约束 body字段为必须。但是这个是程序端的一个约束认证，如果直接在数据库中插入这行数据，也是正确的。
// mongdb 是绝对的自由，你想怎么存怎么存。你存的什么查询的时候 就给你什么。
// 存在即合理 ！！！ 这里的定义只是一种程序约束。
const NewsSchema = mongoose.Schema({

  title: {type: String, required: true},
  body: {type: String, required: true},

});

// 将上面的数据库映射为model, 并导出(使用该model时需要导入);
export default mongoose.model('News', NewsSchema);