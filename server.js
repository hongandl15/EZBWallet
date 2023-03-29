require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/user.js')
const port = 8080

// mongoose.connect('mongodb://localhost:27017/e-wallet', function (err) {
//     if (err) throw err;
//     console.log('Kết nối database thành công');
// });
mongoose.connect(process.env.MONGO_URL, function (err) {
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

    new User({
        username: "0123456782",
        password: "12345",
        fullname: "Nguyễn Hoàng Duy",
        phone: '0123456782',
        email: '0123456782@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'unverified',
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
    new User({
        username: "0123456783",
        password: "12345",
        fullname: "Võ Hoàng Huy",
        phone: '0123456783',
        email: '0123456783@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'blocked',
        role: 'user',
        wrongpw: 0,
        unusuallogin: 0,
        idcard:{
            photofrontName: "IDCard",
            photofrontPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
            photobackName: "IDCard",
            photobackPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
        }
    }).save(); new User({
        username: "0123456784",
        password: "12345",
        fullname: "Võ Hoàng Đông",
        phone: '0123456784',
        email: '0123456784@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'disabled',
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
    new User({
        username: "0123456785",
        password: "12345",
        fullname: "Phan Hồ Tuấn Kiệt",
        phone: '0123456785',
        email: '0123456785@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'RequestIDCard',
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

    new User({
        username: "0123456786",
        password: "12345",
        fullname: "Nguyễn Minh Châu",
        phone: '0123456786',
        email: '0123456786@gmail.com',
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

    new User({
        username: "0123456787",
        password: "12345",
        fullname: "Vũ Ngọc Minh Hân",
        phone: '0123456787',
        email: '0123456787@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'unverified',
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
    new User({
        username: "0123456788",
        password: "12345",
        fullname: "Mai Quang Định",
        phone: '0123456788',
        email: '0123456788@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'blocked',
        role: 'user',
        wrongpw: 0,
        unusuallogin: 0,
        idcard:{
            photofrontName: "IDCard",
            photofrontPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
            photobackName: "IDCard",
            photobackPath: "D:\Web\E-wallet/public/photo/IDCard.jpg",
        }
    }).save(); new User({
        username: "0123456789",
        password: "12345",
        fullname: "Nguyễn Cảnh Tùng",
        phone: '0123456789',
        email: '0123456789@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'disabled',
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
    new User({
        username: "0123456780",
        password: "12345",
        fullname: "Phan Quốc Hưng",
        phone: '0123456780',
        email: '0123456780@gmail.com',
        address: '209 Bui Thi Xuan',
        Birthdate: '08/12/2022',
        balance: '0',
        firstLogin: false,
        status: 'RequestIDCard',
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

    
    app.listen(port, () => console.log(`Express started on https:/localhost:${port};`))
})
