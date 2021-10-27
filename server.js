const app = require('./app');
const dotenv = require('dotenv');
const Message = require('./models/messageSchema'); 
// console.log(app.get('port'));
const server = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
io.on('connection',socket=>{
    console.log(socket.id);
    socket.on('send-message',message=>{
        Message.create({message:message.message,sender:message.sender_resiver.sender,resiver:message.sender_resiver.resiver})
        let senderEmitName = message.sender_resiver.resiver+message.sender_resiver.sender
        socket.broadcast.emit(senderEmitName,message)
        // socket.broadcast.emit('resive-message','hello to the all clients')
    })
})
const mongoose = require('mongoose');
dotenv.config({path:"./config.env"});
const DB = process.env.MONGODB_DATABASE.replace('<PASSWORD>',process.env.MONGODB_USER_PASSWORD)

/**
mongo options
,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}
are removed form new version from v:6.6.0 so pls ignore above options they set to default
 */
mongoose.connect(DB).then(con=>{
    // console.log(con.connections);
    console.log("your are now connected to the server");
}).catch(err=>console.log(err))

server.listen(process.env.PORT || 3000,()=>{
    console.log(`app is running at port ${process.env.PORT}`);
})