const nodemailer =  require('nodemailer');
require('dotenv').config()
function generate_password(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < n; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function generate_username(n) {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < n; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function getDate(inputdate){
    let date_ob = new Date(inputdate);

    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    let outputDate = date + "/" + month + "/" + year 

    return outputDate
}

function getTime(inputdate){
    let date_ob = new Date(inputdate);
    // let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    // let seconds = date_ob.getSeconds();
    return minutes
}

function sendmail(receiver, content, title){
    var transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'walletezb@gmail.com', //Tài khoản gmail 
            pass: 'miiflqcjyblsxbti' //Mật khẩu tài khoản gmail
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var Options = { 
        from: 'EZB Wallet',
        to: receiver,
        subject: title,
        html: content //Nội dung html 
    }

    transporter.sendMail(Options, function(err, info){
        if (err) console.log(err)
        else console.log('Message sent: ' +  info.response);
        
    });
}

module.exports = {generate_password, generate_username, getDate, getTime, sendmail};