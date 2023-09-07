
require('dotenv').config();
const express  = require ('express');
const app =  express(); //carrega o express

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://code.jquery.com"
  );
  next();
});

const  mongoose  = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology:true,
    useFindAndModify: false,
  })
.then(() => {
app.emit('pronto');
})
.catch(e => console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes')
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware }  = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({

  secret:'texto secreto()',
  store: new MongoStore({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24*7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);






app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('acessar http://localhost:3000');
    console.log('servidor executando na porta 3000');
  });
});