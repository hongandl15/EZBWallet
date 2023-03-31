const express = require('express')
var router = express.Router();
const User = require('../models/user.js')
const utils = require('../utils.js')
var formidable = require('formidable');
var config = require('../config.js')
var fs = require('fs')

// register - Chức năng đăng kí
router.get('/register', (req, res) => {
    var error = req.session.registererror;
    req.session.registererror = null
    res.render('./Account/register',  {layout: 'main-login', title: 'Đăng kí', err: error})
})
router.post('/register', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, async function(err, fields, files){
            if(err) return res.redirect(303, '/404');


            var newusername = utils.generate_username(9) // Tạo username
            var newpassword = utils.generate_password(6) // Tạo password
            User.findOne({phone: fields.phone}, function(err, user){    
                if(user != null){
                    req.session.registererror = 'SĐT đã tồn tại'
                    return res.redirect('/register')
                }
            }).lean()

            User.findOne({email: fields.emails}, function(err, user){    
                if(user != null){
                    req.session.registererror = 'Email đã tồn tại'
                    return res.redirect('/register')
                }    
                else{ 
                    var photofrontName = fields.phone + 'IDCardFront' // Tạo tên cho ảnh CMND mặt trước SĐT + IDCardFront
                    var photobackName = fields.phone + 'IDCardBack'// Tạo tên cho ảnh CMND mặt sau SĐT + IDCardBack

                    // Thiết lập nơi chứa file ảnh
                    var frontoldPath = files.photofront.filepath
                    var frontnewPath = config.PhotoDir + '/' + photofrontName + ".jpg" 

                    var backoldPath = files.photoback.filepath
                    var backnewPath = config.PhotoDir + '/' + photobackName + ".jpg"
                    fs.copyFile(frontoldPath, frontnewPath, function (err) { //Di chuyển file ảnh CMND mặt trước
                        if (err) throw err;
                    });
                    fs.copyFile(backoldPath, backnewPath, function (err) { //Di chuyển file ảnh CMND mặt sau
                        if (err) throw err;
                    });
                            
                    new User({
                        username: newusername,
                        password: newpassword,
                        fullname: fields.fullname,
                        phone: fields.phone,
                        email: fields.email,
                        address: fields.address,
                        Birthdate: utils.getDate(fields.birthdate),
                        balance: 0,
                        firstLogin: true,
                        status: 'unverified', // Tài khoản mới tạo sẽ chưa được xác minh
                        role: 'user',
                        wrongpw: 0,
                        unusuallogin: 0,
                        idcard:{
                            photofrontName: photofrontName,
                            photofrontPath: frontnewPath,
                            photobackName: photobackName,
                            photobackPath: backnewPath,
                        } ,
                    }).save();

                    // Chức năng gửi email username và password
                    content = `
                            <div style="padding: 10px; background-color: white;">
                                <h4 style="color: #0085ff">Cảm ơn bạn đã đăng kí tài khoản EZB Wallet</h4>
                                <span style="color: black">Đây là username và password của bạn</span>
                                <p style="color: black">username: ` + newusername + `</p>
                                <p style="color: black">password: ` + newpassword + `</p>
                            </div>
                    `;
                    title = 'Tạo tài khoản thành công'
                    utils.sendmail(fields.email, content, title)
                    req.session.loginsuccess = 'Đăng kí thành công, tài khoản và mật khẩu đã được gửi về email của bạn. Nếu không nhận được mail hãy kiểm tra thư mục spam'
                    return res.redirect('/')
                }
            }).lean()
        }) ; 
}) 

module.exports = router;