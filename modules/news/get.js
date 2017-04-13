/**
 * Copyright(c) omk 2016
 * Filename:
 * Author  : alixez
 */
import mongoose from 'mongoose';

const News = mongoose.model('News');

// 专业术语介绍 [es] 就是javascript的语法标准 （es5 应该是你目前使用的标准，但是这个现在逐渐在被淘汰。）
// async / await 是 es7 的语法标准，这里我做了语法翻译，不用考虑语法不兼容，最新的语法都可以写
// async/await 是 es7 提出的新的异步标准。关于什么是异步 可以自己去网上查询。之所以大家逐渐使用js做后台，就是因为它的异步io
// 效率非常高。
// es6 实现异步是通过 Promise

// es5 实现异步是通过方法回调。es7 的语法标准比较简单，我推荐你用es7的。promise有点复杂。方法回调就不用考虑了。

export default async function (req) {
  const {id} = req.query;

  if (!id) {
    return '请传递新闻id';
  }

  // 由于 mongoose 的所有数据库操作均是异步进行的。所以需要 await; 这个架构里面的所有耗时操作也都是异步。所以异步你一定要去了解下否则你看不懂。
  const newsInfo = await News.findOne({_id: id});

  return {
    message: '查找成功',
    code: 1000,
    data: newsInfo,
  };

}


function demo() {
  // 还有，你肯定发现一些你完全不懂的语法 () => {}  箭头方法， 这个是es6的新语法。
  // 我直接写代码对比
  // 在 es5 里面写变量方法或者、回调方法
  var test1 = function(parm1) {

  };

  // 等价与 es6 里面
  const test2 = (parm1) => {

  }
  // 或者, 只有一个参数，小括号可以省略
  const test3 = parm1 => {

  }

  // 接下来说说区别， 为什么用箭头方法
  // 为了解决 js 的 this 调用域的问题
  // 看demo2

}

// 写一个你最熟悉的 $.ajax\

// 假设有一个异步回调方法。 demo2

function foo(a, b, callback) {
  // ...

  callback();
}

function run() {
  this.test = 123;
  this.test2 = 456;
  var a, b;

  foo(a, b , function() {
    // 现在回调域里面的 this 和 外面的 this相同么？ 不同， 这里的this指的是当前的方法域！
    // 所以如果 console.log(this.test); 结果是 undefined;

    // 如果需要使用this, 以前的解决方案是这样， 黄波也讲过
    // 再外面 重复值 如下 run2
  });
}

function run2() {
  this.test = 123;
  this.test2 = 456;
  var a, b;

  var _this = this;
  foo(a, b, function () {
    console.log(_this.test);
    // 或者 看下面的方法
  });

  foo(a,b, function () {
    console.log(_this.test);
  }.bind(this));

  // 这样只是一层回调， 如果回调多了，非常容易出错。因为你都懵了，现在的this是什么？ 这也是js一直以来的问题，this是什么？

  // 但是如果使用箭头方法 如下, this就是当前的对象的this, 不是其他的东西，this 就是 this。
  foo(1, 2, () => {console.log(this.test)});

  // 还有其他很多区别。这个理由足够给自己找借口使用箭头方法了。
}

