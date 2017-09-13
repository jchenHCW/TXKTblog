var perpage = 3;
var page = 1;
var pages = 0;
var posts = [];
/*提交评论*/
$(function () {
    $('#PostBox').find('#bt_txt').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/comment/post',
            data: {
                postcontent: $('#text_post').val(),
                contentid: $('#contentId').val()
            },
            dataType: 'json',
            success: function (resData) {
                //console.log(resData);
                postcontent:$('#text_post').val('');                //清空评论栏目输入内容
                posts=resData.data.posts.reverse();
                window.location.reload();//重载下以保证评论条数实时更新
                renderPost();
            }
        })
    })
});


/*每次文章重载的时候获取一下该文章的所有评论*/
$(function () {
    $.ajax({
        type: 'get',
        url: '/api/comment',
        data: {
            contentid: $('#contentId').val()
        },
        dataType: 'json',
        success: function (resData) {
            $('#messagecount1').html(posts.length);
            $('#messagecount2').html(posts.length);
            posts=resData.data.reverse();
            renderPost();
        }
    })
});
$(function () {
    $('.pager').delegate('a', 'click', function () {
        if ($(this).parent().hasClass('previous')) {
            //alert(0)
            page--;
        } else {
            //alert(1)
            page++;
        }
        renderPost();
    });
});



function renderPost() {
    $('#messagecount1').html(posts.length);
    $('#messagecount2').html(posts.length);
    $('#page1').html(page);

    pages = Math.max(Math.ceil(posts.length / perpage),1);
    $('#page2').html(pages);
    var start =Math.max(0,(page - 1) * perpage);
    var end = Math.min(start + perpage,posts.length);


    var $lis = $('.pager li');
    $lis.eq(0).html(page + '/' + pages);
    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了！</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(3).html('<span>没有下一页了！</span>');
    } else {
        $lis.eq(3).html('<a href="javascript:;">下一页</a>');
    }


    var html = '';
    for (var i = start; i < end; i++) {
        html += '<div class="messageBox">\n' +
            '                <div class="col-md-6">' + posts[i].username + '</div>\n' +
            '                <div class="col-md-6 ">' + formatDate(posts[i].postTime) + '</div>\n' +
            '                <div><span>' + posts[i].postcontent + '</span></div>\n' +
            '            </div>'
    }
    $('.messagelist').html(html);
}


function formatDate(d) {
    //console.log(d);
    var date1 = new Date(d);
    return date1.getFullYear() + '-' + date1.getMonth() + '-' + date1.getDate() + ' ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds()
}
