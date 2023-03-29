const express = require('express');
var router = express.Router();
const User = require('../models/user.js')
const utils = require('../utils.js')

// home - trang chủ
router.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    let us = req.session.user
    var success = req.session.success
    var error = req.session.error
    var warning = req.session.warning
    req.session.success = null
    req.session.error = null
    req.session.warning = null
    req.session.firstloginerror = null
    User.findOne({username: us.username}, function(err, user){
        if(user != null){   
            req.session.user = user
            if(req.session.user.firstLogin) 
                return res.render('./Account/firstlogin', {layout: 'main-login'}) 
            else if(user.role == "admin") // Kiểm tra role của tài khoản để render đúng giao diện
                return res.render('./Admin/admin', {layout:'main-admin',title: 'Quản trị viên', user, success: success, error: error}) 
            return res.render('./Home/index', {title: 'Trang chủ', user , success: success, error: error, warning: warning})
        }
    }).lean()      
})

// login - chức năng đăng nhập
router.get('/login', (req, res) => {
    var error = req.session.loginerror;
    var success = req.session.loginsuccess
    req.session.loginerror = null
    req.session.loginsuccess = null
    return res.render('./Account/login', {layout: 'main-login', title: 'Đăng nhập', error: error, success: success })
})

router.post('/login', function(req, res){
    let us = req.body.username
    let pw = req.body.password
    User.findOne({username: us}, function(err, user){
        if(user != null){
            var wrongpassword = user.wrongpw
            var unusuallogin = user.unusuallogin
            var blocktime = user.unusuallogintime
            if (user.status == 'disabled') {
                // Thông báo tài khoản bị vô hiệu hóa
                req.session.loginerror = 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008';
                return res.redirect("/login")
            }
            else if(user.unusuallogin == 1){// Thông báo tạm khóa tài khoản khi sai mật khẩu 3 lần
                if(blocktime == utils.getTime(new Date)){ //Kiểm tra thời gian đã qua 1 phút hay chưa
                    req.session.loginerror = 'Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút';
                    return res.redirect("/login")
                }
            }
            else if (user.status == 'blocked'){ // Thông báo khóa tài khoản khi sai mật khẩu quá nhiều lần
                req.session.loginerror = 'Tài khoản đã bị khóa vô thời hạn, vui lòng liên hệ quản trị viên để được hỗ trợ';
                return res.redirect("/login")
            }  
              
            if(pw == user.password){       // Kiểm tra mật khẩu đúng hay không  
                req.session.user = user                
                req.session.success = 'Đăng nhập thành công, chào mừng đến với website'      
                User.updateOne({username: us}, {$set: {wrongpw: 0, unusuallogin: 0}}, function(){}); // reset số lần sai mật khẩu và số lần đăng nhập bất thường sau khi đăng nhập thành công
                return res.redirect('/')   

            }else if (user.role != "admin") {   // Mật khẩu sai và tài khoản không phải admin thì +1 số lần sai mật khẩu
                wrongpassword+=1
                if(wrongpassword == 3 || wrongpassword == 6){ // lần sai thứ 3 hoặc thứ 6 liên tiếp thì +1 số lần đăng nhập bất thường
                    unusuallogin += 1
                    if(unusuallogin== 2)
                        var block = 'blocked'
                    var unusuallogintime = utils.getTime(new Date) // Lưu thời gian đăng nhập nhập bất thường để phục vụ chức năng tạm khóa
                }
                User.updateOne({username: us}, {$set: {wrongpw: wrongpassword, unusuallogin: unusuallogin, unusuallogintime: unusuallogintime, status: block} },  function(){});
            }
            req.session.loginerror = 'Sai mật khẩu'
            return res.redirect("/login")
        }
        else {
            req.session.loginerror = 'Sai thông tin đăng nhập'
            return res.redirect("/login")
        }
    });
});

// firstlogin - Đăng nhập lần đầu
router.post('/firstlogin', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    let user = req.session.user
    if(req.body.password == req.body.passwordconfirm){         // Kiểm tra mật khẩu trùng khớp 
        User.updateOne({username: user.username}, {$set: {password: req.body.password, firstLogin: false}}, function(){}); // cập nhật lại firstLogin: false
        req.session.success = 'Đăng nhập thành công, chào mừng đến với website'
    }
    else{ 
        req.session.firstloginerror = 'Mật khẩu không trùng khớp'
        return res.render('./Account/firstlogin', {layout: 'main-login', error: req.session.firstloginerror}) 
    }
    return res.redirect('/')
})

// logout - Chức năng đăng xuất
router.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;