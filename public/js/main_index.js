//显示登陆,隐藏注册
$(function () {
    var $loginbox = $('#loginbox');
    var $regbox = $('#regbox');
    var $userdata = $('#userdata');

    //切换到注册面板
    $loginbox.find('a.colMint').on('click', function () {
        $loginbox.hide();
        $regbox.show();
    });

    //切换到登陆面板
    $regbox.find('a.colMint').on('click', function () {
        $loginbox.show();
        $regbox.hide();
    });

    //注册
    $regbox.find('#txt_bt').on('click', function () {
        $.ajax({
            type: 'post',
            url: 'api/user/reg',
            data: {
                username: $('#txt_user').val(),
                password: $('#txt_pwd').val(),
                repassword: $('#txt_repwd').val()
            },
            dataType: 'json',
            success: function (data) {
                $regbox.find('.colWarning').html(data.message);
                //注册成功之后
                if (!data.code) {
                    setTimeout(function () {
                        $loginbox.show();
                        $regbox.hide();
                    }, 1000)
                }
            }
        })
    });
    //登陆
    $loginbox.find('#login_bt').on('click', function () {
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data: {
                username: $('#login_user').val(),
                password: $('#login_pwd').val()
            },
            dataType: 'json',
            success: function (data) {
                $loginbox.find('.colWarning').html(data.message);
                //登陆成功之后
                if (!data.code) {
                    setTimeout(function () {
                        // $loginbox.hide();
                        // $userdata.show();
                        window.location.reload();
                    }, 1000)
                }
            }
        })
    });
    // 退出
    $userdata.find('#logout').on('click', function () {
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success: function () {
                window.location.reload();
            }
        })
    });


});


