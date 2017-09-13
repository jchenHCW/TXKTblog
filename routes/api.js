var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
var Category = require('../models/Category');


//统一返回格式。
var resData;
//表示每个路由都要调用这个中间件
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: ''
    };
    next();
});


/*注册*/
/*
* 用户注册
* 注册逻辑
* 1.用户名不能为空
* 2.密码不能为空
* 3.两次输入密码必须一致
*/
router.post('/user/reg', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    //用户名不能为空
    if (username == '') {
        resData.code = 1;
        resData.message = '用户名不能为空!';
        res.json(resData);
        return;

        //密码是否为空
    }
    if (password == '') {
        resData.code = 2;
        resData.message = '密码不能为空!';
        res.json(resData);
        return;
    }
    if (password != repassword) {
        resData.code = 3;
        resData.message = '2次输入的密码不一致!';
        res.json(resData);
        return;
    }


    //查询数据库中是否存在注册用户
    User.findOne({username: username}).then(function (userInfo) {
        //如果用户名存在
        //console.log(userInfo);

        if (userInfo) {
            resData.code = 4;
            resData.message = '用户名已经被注册了';
            res.json(resData);
            return;
        }
        //否则存入用户名数据到数据库中
        var user = new User({
            username: username,
            password: password
        });
        user.save(function (newUserInfo) {
            resData.message = '注册成功';
            res.json(resData);
            //res.json(resData);
            //res.redirect('/login');
        });
    })
});

//登陆
router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    //用户名和密码不能为空
    if (username == '' || password == '') {
        resData.code = 5;
        resData.message = '用户名和密码不能为空!';
        res.json(resData);
        return;
    }
    /*查询数据库中用户名和密码是否存在*/
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            resData.code = 6;
            resData.message = '用户名或密码错误!';
            res.json(resData);
            return;
        }
        //用户名和密码存在，登陆成功
        else {
            resData.message = '登陆成功!';
            resData.userInfo = {
                _id: userInfo._id,
                username: userInfo.username
            };
            //发送cookies信息到客户端
            req.cookies.set('userInfo', JSON.stringify({
                _id: userInfo._id,
                username: userInfo.username
            }));
            res.json(resData);
            return;
        }

    })

});

router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    res.end();
});


/*获取指定文章的所有评论*/
router.get('/comment',function (req,res) {
   var contentId=req.query.contentid||'';
   Content.findOne({_id:contentId}).then(function (content) {
       resData.data=content.posts;
       res.json(resData);
   })
});


/*
* 评论提交
* */
router.post('/comment/post', function (req, res) {
    var contentId = req.body.contentid || '';
    //console.log(req.body.contentid);
    var postData = {
        username: req.userInfo.username,
        postTime:new Date(),
        postcontent: req.body.postcontent
    };
    //查询当前这篇文章内容的信息
    Content.findOne({_id: contentId}).then(function (content) {
        content.posts.push(postData);
        return content.save();
    }).then(function (newContent) {
        resData.message = '评论成功';
       // console.log(resData);
        resData.data=newContent;
        res.json(resData);
    });
});


module.exports = router;
