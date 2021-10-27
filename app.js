const express = require('express');
const dotenv = require('dotenv');//required where we are using the env files like server.js
const morgan = require('morgan')//it simply watch for request status
const userRouter = require('./Routers/userRouter');
const messageRoute = require('./Routers/messageRouter');
const webRoute = require('./Routers/webRouter')
const globalErrorHandle = require('./utils/erroHandilings/globalErrorHandle');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// app.set('views',`${__dirname}/../views`);
app.set('view engine','ejs')

app.use(express.static('public'))

app.use('/',webRoute)
app.use('/api/v1/users',userRouter);
app.use('/api/v1/message',messageRoute)

app.use(globalErrorHandle)//it will take err as input and res,req,next
if(process.env.NODE_ENV==='development')
    app.use(morgan('dev'))
module.exports=app;