const app = require('./app');
const dotenv = require('dotenv');
const Message = require('./models/messageSchema'); 
const User = require('./models/userSchema');
// console.log(app.get('port'));
const server = require('http').createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);
async function updateUnreadMessage(mainUser,senderUser,incType){
    let updatingUser = await User.findOne({_id:mainUser});
    updatingUser.friends.forEach(ele => {
        if(ele.id.equals(senderUser)){
            if(incType){
                console.log(incType);
                if(!ele.unReadMessages)
                    ele.unReadMessages=1
                else{
                    ele.unReadMessages=ele.unReadMessages+1
                }
            }
            else{
                ele.unReadMessages=0
            }
            updatingUser.save({validateBeforeSave:false})
            return
        }
    });

}
io.on('connection',socket=>{
    console.log(socket.id);

    socket.on('send-message',async message=>{
        Message.create({message:message.message,sender:message.sender_resiver.sender,resiver:message.sender_resiver.resiver})
        let senderEmitName = message.sender_resiver.resiver+message.sender_resiver.sender
        await updateUnreadMessage(new mongoose.Types.ObjectId(message.sender_resiver.resiver),new mongoose.Types.ObjectId(message.sender_resiver.sender),true)
        socket.broadcast.emit(senderEmitName,message)
        // socket.broadcast.emit('resive-message','hello to the all clients')
    })
    socket.on('message-resived',message=>{
        updateUnreadMessage(new mongoose.Types.ObjectId(message.sender_resiver.resiver),new mongoose.Types.ObjectId(message.sender_resiver.sender),false)
    })
    socket.on('open-message-resived',message=>{
        updateUnreadMessage(new mongoose.Types.ObjectId(message.sender_resiver.sender),new mongoose.Types.ObjectId(message.sender_resiver.resiver),false)
    })
    socket.on('send-message-as-notification',message=>{
        socket.broadcast.emit(message.sender_resiver.resiver,message);
    })
    // socket.on('countIncrement',(message)=>{
    //     User.findOne({_id:message.sender_resiver.resiver})
    // })
    socket.on('disconnect',()=>{
        console.log("------------",socket.id);
    })
})
// io.on('disconnect',(socket)=>{

// })
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