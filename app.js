import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import multer from 'multer';
import log4js from 'log4js';
import http from 'http';
import mongoose from 'mongoose';
import {mapUrl} from './utils/url';
import * as actions from './modules';
import config from './config.json';
const log = log4js.getLogger("app");
mongoose.Promise = Promise;

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function appLoader() {
  mongoose.connect(config.db.mongoose);
  const port = normalizePort(process.env.PORT || '3000');
  log4js.configure({
    appenders: [
      {type: 'console'},
      {
        type: 'file',
        filename: './logs/errors.log',
        pattern: '-yyyy-MM-dd',
        level: 'ERROR',
        maxLogSize: 10485760,
        category: ['cheese', 'console', 'http']
      }
    ],
    replaceConsole: true
  });

  const app = express();
  const server = new http.Server(app);
  app.set('port', port);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // 使用不同中间件
  app.use(log4js.connectLogger(log4js.getLogger('http'), {level: 'auto'}));
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, './public')));
  app.use(bodyParser.json({limit: '50mb'}));
  const dest = path.resolve(__dirname, './uploads/');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const suffix = file.mimetype.split('/')[1];
      cb(null, `${randomString()}.${suffix}`);
    }
  });

  app.use(multer({storage}).single('file'));
  app.get('/', (req, res) => {
    res.redirect('/home');
  });
  app.use((req, res) => {
    const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

    const {action, params} = mapUrl(actions, splittedUrlPath);

    if (action) {
      action(req, params)
        .then((result) => {
          if (result instanceof Function) {
            result(res);
          } else {
            res.json(result);
          }
        }, (reason) => {
          const {status, redirect} = reason;
          if (status && parseInt(status / 300, 10) === 3 && redirect) {
            res.redirect(redirect);
          } else {
            log.error('API ERROR:', pretty.render(JSON.stringify(reason)), reason);
            reason.code = dbConfig.code.fail;
            res.status(reason.status || 200).json(reason);
          }
        });
    } else {
      res.status(404).end('NOT FOUND');
    }
  });

  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  /**
   * Event listener for HTTP server "listening" event.
   */
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    log.info('===> [厨匠应用]chief is running on port %s', port);
    log.info('===> [厨匠应用]please open link http://localhost:%s', port);
  };

  app.listen(port, (err) => {
    if (err) {
      console.log(err);
    }
    log.info('===> [厨匠应用]chief is running on port %s', port);
    log.info('===> [厨匠应用]please open link http://localhost:%s', port);
  });

}


// 启动应用

appLoader();

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var index = require('./routes/index');
// var users = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
