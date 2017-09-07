var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');


router.use(function (req, res, next) {
    //如果当前用户是非管理员用户。不准进入
    if (!req.userInfo.isAdmin) {
        res.send('对不起，只有管理员才可以进入后台管理页面!');
        return;
    } else {
        next();
    }

});


/*管理首页*/
router.get('/', function (req, res) {
    res.render('./admin/index', {
        userInfo: req.userInfo
    });
});

/*
用户管理首页
* */
router.get('/user', function (req, res) {
    /*
        *分页：limit(Number)限制从数据库中获取到的数据的条数
        * skip（Number）忽略数据的条数
        * 页数：(每页显示2条）
        * 第1页：limit:显示第1.第2条 忽略0条:skip=(page-1)*limit
        * 第2页：limit:显示第3.第4条 忽略2条:skip=(page-1)*limit
    */
    var page = Number(req.query.page || 1);
    //console.log(page);
    var limit = 3;
    var pages = 0;
    var GoPage = Number(req.query.page || 1);

    User.count().then(function (count) {
        //console.log(pages);
        //计算总页数
        pages = Math.ceil(count / limit);
        //当前页不能超过总页数
        page = Math.min(page, pages);
        //当前页 不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users);
            res.render('./admin/user_index',
                {
                    userInfo: req.userInfo,
                    users: users,
                    page: page,
                    pages: pages,
                    limit: limit,
                    count: count,
                    GoPage: GoPage
                });
        });
    });
});


/*分类首页*/
router.get('/category', function (req, res, next) {
    var page = Number(req.query.page || 1);
    //console.log(page);
    var limit = 2;
    var pages = 0;

    Category.count().then(function (count) {
        //console.log(pages);
        //计算总页数
        pages = Math.ceil(count / limit);
        //当前页不能超过总页数
        page = Math.min(page, pages);
        //当前页 不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        /*
        * sort排序。
        * 升序：1
        * 降序：-1
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            //console.log(users);
            res.render('./admin/category_index',
                {
                    userInfo: req.userInfo,
                    categories: categories,
                    page: page,
                    pages: pages,
                    limit: limit,
                    count: count
                });
        });
    });
});

/*
* 添加分类get*/
router.get('/category/add', function (req, res) {
    res.render('./admin/category_add', {
        userInfo: req.userInfo
    });
});

/*
* 添加分类post*/
router.post('/category/add', function (req, res) {
    var name = req.body.name || '';
    //console.log(name);

    if (name == '') {
        res.render('./admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空!'
        });
        return;
    }
    //查询数据中是否存在同名称的分类
    Category.findOne({name: name}).then(function (rs) {
        if (rs) {
            //数据库中存在该分类了
            res.render('./admin/error', {
                userInfo: req.userInfo,
                message: '该分类名称已经存在了!'
            });
            //console.log("error........");
        } else {
            //数据库中不存在该分类,可以保存
            var category = new Category({
                name: name
            });
            //console.log(name);
            category.save(function (newcategory) {
                res.render('./admin/success', {
                    userInfo: req.userInfo,
                    message: '分类保存成功!',
                    url: '/admin/category/add'
                });
            });
        }
    })
    /*.catch(function(err){
            console.error(err);
        });*/          //抓取promise语法报错的错误信息,promise默认不显示错误
});

/*
* 分页修改*/

router.get('/category/edit', function (req, res) {
    //获取要修改的分类的信息，并且用表单的形式表现出来
    var id = req.query.id || '';
    //console.log(id);
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('./admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在!'
            });
        } else {
            res.render('./admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    });
});

/*
* 分类修改的保存
* * */
router.post('/category/edit', function (req, res) {
    //获取要修改的分类的信息，并且用表单的形式表现出来
    var id = req.query.id || '';
    //获取到要修改的分类名称
    var name = req.body.name || '';

    Category.findOne({
        _id: id
    }).then(function (category) {
        //当用户没有做任何的修改
        if (name == category.name) {
            res.render('./admin/success', {
                userInfo: req.userInfo,
                message: '修改成功,内容无更改!',
                url: '/admin/category'
            });
        } else {
            Category.findOne({
                _id: {$ne: id},
                name: name
            }).then(function (samecategory) {
                if (samecategory) {
                    res.render('./admin/error', {
                        userInfo: req.userInfo,
                        message: '该分类名称已经存在!'
                    });
                } else {
                    Category.update({_id: id}, {name: name}).then(function () {
                        res.render('./admin/success', {
                            userInfo: req.userInfo,
                            message: '修改成功!',
                            url: '/admin/category'
                        })
                    })
                }
            })
        }
    })
});

/*
* 分类删除
* */
router.get('/category/delete', function (req, res) {
    //获取要删除的分类的名称
    var id = req.query.id;

    Category.remove({
        _id: id
    }).then(function () {
        res.render('./admin/success', {
            userInfo: req.userInfo,
            message: '删除成功!',
            url: '/admin/category'
        })
    })

});

/*内容首页*/
router.get('/content', function (req, res) {
    var page = Number(req.query.page || 1);
    //console.log(page);
    var limit = 2;
    var pages = 0;

    Content.count().then(function (count) {
        //console.log(pages);
        //计算总页数
        pages = Math.ceil(count / limit);
        //当前页不能超过总页数
        page = Math.min(page, pages);
        //当前页 不能小于1
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;

        /*
        * sort排序。
        * 升序：1
        * 降序：-1
        * */
        Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['user','category']).then(function (contents) {
            console.log(contents);
            res.render('./admin/content_index',
                {
                    userInfo: req.userInfo,
                    contents: contents,
                    page: page,
                    pages: pages,
                    limit: limit,
                    count: count
                });
        });
    });
});

/*添加内容*/
router.get('/content/add', function (req, res) {
    //先获取到所有的分类信息
    Category.find().sort({_id: -1}).then(function (categories) {
        //console.log(categories);
        res.render('./admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });
});
/*
* 保存添加的内容*/
router.post('/content/add', function (req, res) {
    //console.log(req.body)
    if (req.body.title == '') {
        res.render('./admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function (rs) {
        res.render('./admin/success', {
            userInfo: req.userInfo,
            message: '保存成功!',
            url: '/admin/content'
        })
    });
});


/*修改内容*/
router.get('/content/edit', function (req, res) {
    var id = req.query.id;
    var categories = [];

    Category.find().sort({_id: -1}).then(function (result) {
        categories = result;
        //console.log(categories);
        return Content.findOne({_id: id}).populate('category').then(function (content) {
            console.log(content);
            res.render('./admin/content_edit', {
                userInfo: req.userInfo,
                categories: categories,
                content: content
            })
        })
    });
});

/*
* 保存修改内容*/
router.post('/content/edit', function (req, res) {
    var id = req.query.id || '';
    if (req.body.title == '') {
        res.render('./admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
        //保存数据到数据库
    Content.updateMany({_id: id},{category:req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content}).then(function () {
        res.render('./admin/success', {
            userInfo: req.userInfo,
            message: '修改成功!',
            url: '/admin/content/edit?id='+id
        })
    })
});
/*删除内容*/
router.get('/content/delete', function (req, res) {
    //获取要删除的id
    var id = req.query.id;

    Content.remove({
        _id: id
    }).then(function () {
        res.render('./admin/success', {
            userInfo: req.userInfo,
            message: '删除成功!',
            url: '/admin/content'
        })
    })

});

module.exports = router;
