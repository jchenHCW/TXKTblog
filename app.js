var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');
var Cookies = require('Cookies');
var User = require('./models/User');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);

    // console.log(req.cookies.get('userInfo'));
    //解析登陆用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前登录用户的信息是否为管理员
                User.findById(req.userInfo._id).then(function (userInfo) {
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                    next();
                })
        } catch (e) {}
    }else{
        next();
    }
});


app.use('/', require('./routes/main'));

app.use('/api', require('./routes/api'));

app.use('/admin',require('./routes/admin'));



// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/


mongoose.connect('mongodb://localhost:27019/0905', function (err) {
    if (err) {
        console.log('数据库连接失败!');
    } else {
        console.log('数据库连接成功!');
        app.listen(3000, function () {
            console.log(new Date());
        });
    }
});


module.exports = app;