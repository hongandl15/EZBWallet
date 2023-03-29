const mongoose = require('mongoose')
const User = require('./models/user.js')
const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const app = express()
var path = require('path')
const port = process.env.PORT || 8080
const wallet = require('./controllers/wallet.js')
const login = require('./controllers/login.js')
const register = require('./controllers/register.js')
const admin = require('./controllers/admin.js')
const user = require('./controllers/user.js')
// mongoose.connect('mongodb://localhost:27017/e-wallet', function (err) {
//     if (err) throw err;
//     console.log('Kết nối database thành công');
// });
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



require('./server.js')
app.engine('handlebars', hbs.engine({defaultLayout: 'main',}))
app.use(express.urlencoded())
app.use(session({ secret: 'fafsdhalj' }))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, './public')));

app.use(function(req, res, next) { // không hiển thị lại message session khi back lại trang
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.use('/', login)
app.use('/', user)
app.use('/', register)
app.use('/', wallet)
app.use('/', admin)


app.listen(port, () => console.log(`Express started on https:/localhost:${port};`))

// app.listen(port, () => console.log(`Express started on https:/localhost:${port};`))
