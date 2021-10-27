const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:[true,'message must had a sender']
    },
    resiver:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:[true,'message must had a resiver']     
    },
    message:{
        type:String,
        required:[true,'message must not be empty']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
messageSchema.index({sender:1,resiver:1});
messageSchema.pre(/^find/,function(){
    this.populate({
        path:'sender',
        select:'name email'
    }).populate({
        path:'resiver',
        select:'name email'
    })
})

const Message = mongoose.model('message',messageSchema);
Message.watch().on('change',data=>{
    console.log(data);
})
module.exports = Message;