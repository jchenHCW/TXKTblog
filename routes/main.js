var express = require('express');
var router = express.Router();
var User = require('../models/User');
var mongoose = require('mongoose');
var Category = require('../models/Category');
var Content = require('../models/Content');


var data;

/*处理通用数据*/
router.use(function (req,res,next) {
    data={
        userInfo: req.userInfo,
        categories:[]
    };

    //读取所有的分类信息
    Category.find().then(function (categories) {
        data.categories=categories;
        next();
    })
});




/* GET home page. */
router.get('/', function (req, res, next) {
        data.page =Number(req.query.page || 1);
        data.limit =6;
        data.pages = 0;
        data.count=0;
        data.contents=[];
        data.category=req.query.category||'';
    var where={};


    if(data.category){
        where.category=data.category;
    }

    Content.where(where).count().then(function (count) {
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
        res.render('./main/index',data)

    })
});


router.get('/view', function (req, res, next) {
    //console.log(req.query.contentid);
    var contentId=req.query.contentid||'';
    //res.json(1)
    Content.findOne({_id:contentId}).then(function (content) {
        data.content=content;
        content.views++;
        content.save();
        //console.log(content.posts[1].postcontent);
        res.render('./main/view',data);
    });
});


module.exports = router;
