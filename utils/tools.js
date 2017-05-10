/**
 * Created by alixez on 17-5-10.
 */
import mongoose from 'mongoose';

function _callback(resolve, callback, result) {
  if (callback) {
    callback(resolve, result);
  } else {
    resolve(result);
  }
}

export function listGenerator(req, modelName, extraArgs = [], {populate, deepPopulate, sort, callback} = {}) {
  return new Promise((resolve, reject) => {
    const Model = mongoose.model(modelName);
    let totalPage = 0;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    let skip = parseInt(req.query.skip) || (page - 1) * limit;
    let args = {};
    if (extraArgs && extraArgs.length > 0) {
      extraArgs.forEach(looper => {
        if (typeof looper === 'string') {
          let value = req.query[looper];
          if (typeof value !== 'undefined') {
            args[looper] = value;
          }
        } else if (typeof looper === 'object') {
          Object.assign(args, looper);
        } else if (typeof looper === 'function') {
          Object.assign(args, looper(req));
        }
      });
    } else {
    }
    Model.count(args, (error, count) => {
      if (error) {
        reject({msg: error.message});
      } else {
        if (count === 0) {
          _callback(resolve, callback, {
            code: 1000,
            data: {
              total: 0,
              data: []
            }
          });
        } else {
          totalPage = Math.ceil(count / limit);
          var middle = Model.find(args)
            .select('-__v')
            .skip(skip)
            .limit(limit);
          if (deepPopulate && deepPopulate.length > 0) {
            middle = middle.deepPopulate(deepPopulate);
          }
          if (populate) {
            middle = middle.populate(populate);
          }
          if (sort) {
            middle = middle.sort(sort);
          }
          middle.exec((err, docs) => {
            if (err) {
              console.log(err);
              reject({msg: '查找失败！'});
            } else {
              _callback(resolve, callback, {
                code: 1000,
                data: {
                  total: count,
                  curPage: page,
                  totalPage: totalPage,
                  lastPage: page > 1 ? page - 1 : 1,
                  nextPage: page < totalPage ? page + 1 : 1,
                  data: docs
                }
              });
            }
          });
        }
      }
    });
  });
}