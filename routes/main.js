var express = require('express');
var router = express.Router();
var User = require('../models/User');
var mongoose = require('mongoose');
var Category = require('../models/Category');
var Content = require('../models/Content');



/* GET home page. */
router.get('/', function (req, res, next) {

    var data={
        page :Number(req.query.page || 1),
        limit :4,
        pages : 0,
        userInfo: req.userInfo,
        count:0,
        contents:[],
        category:req.query.category||'',
        categories:[]
    };
    var where={};

    if(data.category){
        where.category=data.category;
    }

    //读取所有的分类信息
    Category.find().then(function (categories) {
        //console.log(categories);
        data.categories=categories;
        return Content.where(where).count();
    }).then(function (count) {
        data.count=count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //当前页不能超过总页数
        data.page = Math.min(data.page, data.pages);
        //当前页 不能小于1
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;

        return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function (contents) {
        data.contents=contents;
        //console.log(data);
    res.render('./main/index',data)
    })
});


router.get('/view', function (req, res, next) {
    console.log(req.userInfo);
    res.render('./main/view');
});


module.exports = router;
