var express = require('express');
var router = express.Router();
var User = require('../models/User');
var mongoose = require('mongoose');
var Category = require('../models/Category');


/* GET home page. */
router.get('/', function (req, res, next) {
        //读取所有的分类信息
    Category.find().sort({_id:-1}).then(function (categories) {
       //console.log(categories);
        res.render('./main/index', {
            //渲染index模板里面的用户信息(利用/api/user/login传递cookies).
            userInfo: req.userInfo,
            categories:categories
        });
    });
});


router.get('/view', function (req, res, next) {
    console.log(req.userInfo);
    res.render('./main/view');
});






module.exports = router;
