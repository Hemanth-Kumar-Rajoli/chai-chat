const checkAsync = require('../utils/erroHandilings/checkAsync');
const Message = require('./../models/messageSchema');
const AppError = require("../utils/erroHandilings/appErrorController");
const APIFeatures = require('./../utils/apiFeatures');
exports.createMessage = checkAsync(async(req,res,next)=>{
    const sender=req.user._id;
    const {resiver} = req.body;
    const {message} = req.body
    const messageResived = await Message.create({sender,resiver,message});
    res.status(201).json({
        status:'success',
        data:{
            messageResived
        }
    })
})
exports.getAllMessage = checkAsync(async(req,res,next)=>{
    const queryModel = (new APIFeatures(Message.find(),req.query)).filter().pagingAndLimiting().requireFields().sort();
    const messages = await queryModel.query;
    res.status(200).json({
        status:'success',
        result:messages.length,
        data:{
            messages
        }
    })
})
// exports.getConversation = checkAsync(async(req,res,next)=>{
//     const sender = req.user.id;
//     const resiver = req.params.resiver
// })