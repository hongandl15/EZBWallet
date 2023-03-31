const mongoose = require('mongoose')
const User = require('./models/user.js')

mongoose.connect('mongodb+srv://cuvitdet15:RL3MaGszOGj5aaGf@cluster0.9iz1xzm.mongodb.net/test', function (err) {
    if (err) throw err;
    console.log('Kết nối database thành công');
});

User.find(function(err, users){
    if(users.length != 0) return;
    new User({
        username: "admin",
        password: "123456",
        fullname: "Admin",
        phone: '0123456789',
        Birthdate: '',
        balance: '1000000',
        firstLogin: false,
        status: 'verified',
        role: 'admin',
    }).save();

    new User({
        username: "0123456781",
        password: "12345",
        fullname: "Nguyễn Hoàng",
        phone: '0123456781',
        email: 'cuvitdet15@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'verified',
        role: 'user',
        wrongpw: 0,
        unusuallogin: 0,
        idcard:{
            photofrontName: "IDCard",
            photofrontPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
            photobackName: "IDCard",
            photobackPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
        }
    }).save();

})

