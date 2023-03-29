const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const app = express()
var path = require('path')
const port = 8080
const wallet = require('./controllers/wallet.js')
const login = require('./controllers/login.js')
const register = require('./controllers/register.js')
const admin = require('./controllers/admin.js')
const user = require('./controllers/user.js')

require('./db.js')
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