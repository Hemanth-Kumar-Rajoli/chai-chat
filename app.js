const express = require('express');
const dotenv = require('dotenv');//required where we are using the env files like server.js
const morgan = require('morgan')//it simply watch for request status
const helmet = require('helmet')
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRouter = require('./Routers/userRouter');
const messageRoute = require('./Routers/messageRouter');
const webRoute = require('./Routers/webRouter')
const globalErrorHandle = require('./utils/erroHandilings/globalErrorHandle');
const app = express();
app.enable('trust proxy');
//security Http headers
dotenv.config({path:"./config.env"});
app.use(helmet({
    contentSecurityPolicy:false
}))
app.use(function(req, res, next) { 
    res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdn.jsdelivr.net https://cdn.socket.io" ); 
    next(); 
})
// if(process.env.NODE_ENV==='development')
//     app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(mongoSanitize());
app.use(xss());
// app.set('views',`${__dirname}/../views`);
app.set('view engine','ejs')

app.use(cors());//Access-Control-Allow-Origin *

app.options('*',cors())

app.use(express.static('public'))

app.use('/',webRoute)
app.use('/api/v1/users',userRouter);
app.use('/api/v1/message',messageRoute)

app.use(globalErrorHandle)//it will take err as input and res,req,next

module.exports=app;