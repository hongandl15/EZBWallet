const express = require('express')
var router = express.Router();
const Transaction = require('../models/Transaction.js')
const User = require('../models/user.js')
const utils = require('../utils.js')
var fs = require('fs');

//deposit - chức năng nạp tiền
router.get('/deposit', (req, res,) => {
    if (!req.session.user) return res.redirect('/login')
    else if(req.session.user.firstLogin){ 
        return res.render('./Account/firstlogin') 
    }
    else if(req.session.user.status != 'verified'){ // Kiểm tra tài khoản đã xác minh
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    } 
    return res.render('./Wallet/deposit', {title:'Nạp tiền'})
})

router.post('/deposit', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    let cardnumber = req.body.cardnumber
    let cvv = req.body.cvv
    let user = req.session.user
    let expiredate = utils.getDate(req.body.expiredate)
    let date = new Date()
    if (cardnumber == 333333 && cvv == 577 && expiredate == '12/12/2022'){ // thẻ 333333 hết tiền
        return res.render('./Wallet/deposit', {title:'Nạp tiền',error: 'Thẻ hết tiền'})
    } 
    else if ((cardnumber == 111111 && cvv == 411 && expiredate == '10/10/2022') || (cardnumber == 222222 && cvv == 443 && expiredate == '11/11/2022')){ 
        if(cardnumber == 222222 && parseInt(req.body.money) > 1000000)  //thẻ 222222 nạp tối đa 1tr
            return res.render('./Wallet/deposit', {title:'Nạp tiền', error: 'Thẻ này chỉ được nạp tối đa 1.000.000/1 lần'})
        
        userbalance = parseInt(user.balance) + parseInt(req.body.money)
        User.updateOne({username: user.username}, {$set: {balance: userbalance}}, function(){});
        req.session.success = 'Nạp tiền thành công'
        new Transaction({
            username: user.username,
            id: utils.generate_username(6),
            type: 'Nạp tiền',
            date: date,
            status: 'Thành công',
            verified: true,
            value: req.body.money,
        }).save();
    }else{
        console.log("Sai thông tin thẻ")
        return res.render('./Wallet/deposit', {title:'Nạp tiền', error: 'Sai thông tin thẻ'})
    }
    return res.redirect('/')
});

// withdraw
router.get('/withdraw', (req, res) => {
    if (!req.session.user) return res.redirect('/login') 
    else if(req.session.user.firstLogin){ 
        return res.redirect('/')
    }
    else if(req.session.user.status != 'verified'){ // Kiểm tra tài khoản đã xác minh
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    }
    var error = req.session.withdrawerror
    return res.render('./Wallet/withdraw', {title:'rút tiền', error: error})
})

router.post('/withdraw', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    let cardnumber = req.body.cardnumber
    let cvv = req.body.cvv
    let user = req.session.user
    let us = user.username
    let expiredate = utils.getDate(req.body.expiredate)
    let date = new Date()
    if (cardnumber == 111111 && cvv == 411 && expiredate == '10/10/2022'){
        if(req.body.money % 50 == 0){
            if(parseInt(user.balance) >= (parseInt(req.body.money) + (parseInt(req.body.money) * 5 / 100)) ){
                if(req.body.money < 5000000){
                    userbalance = parseInt(user.balance) - parseInt(req.body.money) - (parseInt(req.body.money) * 5 / 100)
                    User.updateOne({username: user.username},
                        {$set: {balance: userbalance} },function(){});
                    req.session.success = 'Rút tiền thành công'   
                    new Transaction({
                        username: us,
                        id: utils.generate_username(6),
                        type: 'Rút tiền',
                        date: date,
                        status: 'Thành công',
                        creditcard: cardnumber,
                        cvv: cvv,
                        verified: true,
                        value: req.body.money,
                    }).save(); 
                }else {
                    req.session.warning = 'Rút tiền trên 5.000.000đ phải chờ phê duyệt'   
                    new Transaction({
                        username: us,
                        id: utils.generate_username(6),
                        type: 'Rút tiền',
                        date: date,
                        status: 'Chờ phê duyệt',
                        creditcard: cardnumber,
                        cvv: cvv,
                        verified: false,
                        value: req.body.money,
                    }).save(); 
                }
            }else{
                req.session.withdrawerror = 'Số dư không đủ'
                return res.redirect('/withdraw')
            }      
        }else{
            req.session.withdrawerror = 'Số tiền rút phải là bội số của 50'
            return res.redirect('/withdraw')
        }
    }
    else{
        req.session.withdrawerror = 'Sai thông tin thẻ'
        return res.redirect('/withdraw')
    }
    return res.redirect('/')
})

// transfer
router.get('/transfer', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    else if(req.session.user.firstLogin){ 
        return res.redirect('/')
    }
    else if(req.session.user.status != 'verified'){ // Kiểm tra tài khoản đã xác minh
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    } 
    var error = req.session.transfererror
    return res.render('./Wallet/transfer', {title:'chuyển tiền', error: error})
})

router.post('/transfer', async (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    let note = req.body.note
    let money = req.body.money
    let user = req.session.user
    let senderusername = user.username
    let senderemail = user.email
    let balance = user.balance
    let sendername = user.fullname
    let date = new Date()

        User.findOne({phone: req.body.phone},function(err, user){
            if(user != null){ 
                if(money < 5000000){
                    if(req.body.who_pay == 'sender') {
                        senderbalance = parseInt(balance) - parseInt(money) - (parseInt(money) * 5 / 100)
                        receiverbalance = parseInt(user.balance) + parseInt(money)
                    }
                    else{ 
                        senderbalance = parseInt(balance) - parseInt(money)
                        receiverbalance = parseInt(user.balance) + parseInt(money) - (parseInt(money) * 5 / 100)
                    }

                    if(senderbalance < 0){
                        req.session.transfererror = 'Số dư không đủ'
                        return res.redirect('/transfer')
                    }
                    User.updateOne({username: senderusername}, {$set: {balance: senderbalance}}, function(){}).lean();
                    User.updateOne({phone: req.body.phone}, {$set: {balance: receiverbalance}}, function(){}).lean();
                    var title = 'Giao dịch thành công'
                    var receivercontent = `
                    <div style="padding: 10px; background-color: white;">
                        <h4 style="color: #0085ff">Giao dịch thành công</h4>
                        <p style="color: black">Bạn vừa nhận được số tiền ` + parseInt(money) + ` từ `+ sendername +`</p>
                        <p style="color: black">Số dư hiện tại của bạn là ` + receiverbalance + `</p>
                    </div>
                    `;
                    var sendercontent = `
                    <div style="padding: 10px; background-color: white;">
                        <h4 style="color: #0085ff">Giao dịch thành công</h4>
                        <p style="color: black">Bạn vừa chuyển số tiền ` + parseInt(money) + ` cho `+ user.fullname +`</p>
                        <p style="color: black">Số dư hiện tại của bạn là ` + senderbalance + `</p>
                    </div>
                    `;
                    
                    utils.sendmail(senderemail, sendercontent, title)
                    utils.sendmail(user.email, receivercontent, title)

                    
                    new Transaction({
                        username: senderusername,
                        receiver: req.body.phone,
                        id: utils.generate_username(6),
                        type: 'Chuyển tiền',
                        note: note,
                        date: date,
                        status: 'Thành công',
                        verified: true,
                        value: req.body.money,
                    }).save();
                    req.session.success = 'Chuyển tiền thành công'; 
                    return res.redirect('/') 
                }
                
                new Transaction({
                    username: senderusername,
                    receiver: req.body.phone,
                    id: utils.generate_username(6),    
                    type: 'Chuyển tiền',
                    note: note,
                    date: date,
                    status: 'Chờ phê duyệt',
                    verified: false,
                    value: req.body.money,
                }).save(); 
                req.session.warning = 'Chuyển tiền trên 5.000.000đ phải chờ phê duyệt'; 
                return res.redirect('/')       
            }
        req.session.transfererror = 'Không tìm thấy user'
        res.redirect('/transfer')    
        }).lean()         

    
})


// buycard
router.get('/buycard', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    else if(req.session.user.firstLogin){ 
        return res.redirect('/')
    }
    else if(req.session.user.status == 'unverified'){
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    } 
    var error = req.session.buycarderror
    return res.render('./Wallet/buycard', {title:'Mua card', error: error})
})

router.post('/buycard', (req, res) => {
    if (!req.session.user) return res.redirect('/login')    
    let user = req.session.user
    let us = user.username
    var card = []
        for (let i =0; i < req.body.amount;i++){
            card.push({cardcode: req.body.cardtype + utils.generate_username(5), cardprice: req.body.cardprice})
        }
        console.log(card)
            User.findOne({username: us}, function(err, user){
                if(user != null){
                    var value = parseInt(req.body.cardprice) * parseInt(req.body.amount)
                    var resultbalance = parseInt(user.balance) -  value
                    if(user.balance >= value){
                        User.updateOne({username: us},
                            {$set: {balance: resultbalance} },
                            function(){
                                new Transaction({
                                    username: us,
                                    id: utils.generate_username(6),
                                    type: 'Mua card',
                                    date: new Date(),
                                    status: 'Thành công',
                                    verified: true,
                                    value: parseInt(req.body.cardprice) * parseInt(req.body.amount),
                                    card: card
                                }).save();
                                console.log('Số dư hiện tại: ' + resultbalance);
                        }).lean();
                    return res.render('./Wallet/buysuccessful', {title:'Mua card thành công', card: card})
                    }
                    else{ 
                        req.session.buycarderror = 'Số dư không đủ'
                    }
                   
                } 
                return res.redirect('/buycard')
            }).lean();
})


// history
router.get('/history', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    else if(req.session.user.firstLogin){ 
        return res.redirect('/')
    }
    else if(req.session.user.status != 'verified'){
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    } 
    let user = req.session.user
    Transaction.find({username: user.username}, function(err, trans){
        if(trans != null){
            return res.render('./Wallet/history', {title:'Lịch sử giao dịch', trans: trans})
        } 
        else {  
            console.log(err)
            return res.redirect('/')
        }
    }).lean();
})


// transaction detail
router.get('/transaction/:id', (req, res) => {
    if (!req.session.user) return res.redirect('/login')
    else if(req.session.user.firstLogin){ 
        return res.redirect('/')
    }
    else if(req.session.user.status != 'verified'){
        req.session.error = 'Chức năng này chỉ dành cho tài khoản đã được xác minh'
        return res.redirect('/')
    } 
    let id = req.params.id
    Transaction.findOne({id: id}, function(err, trans){
        if(trans != null){
            console.log(trans)
            return res.render('./Wallet/transaction', trans)
        } 
        else {  
            console.log(err)
            return res.redirect('/')
        }
    }).lean();
})

module.exports = router;