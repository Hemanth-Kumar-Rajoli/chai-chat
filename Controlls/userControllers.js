const User = require('./../models/userSchema');
const AppError = require("../utils/erroHandilings/appErrorController");
const APIFeatures = require('./../utils/apiFeatures');
const checkAsync = require('../utils/erroHandilings/checkAsync');
const {sendJwt,setCookie} = require('./authControllers');
const sharp = require('sharp');
const bcrypt = require('bcrypt')
const multer = require('multer')

// const multerStorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,'public/imgs');
//     },
//     filename:(req,file,cb)=>{
//         const ext = file.mimetype.split('/')[1];
//         cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// })
const multerStorage = multer.memoryStorage();
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }
    else{
        cb(new AppError({message:'pls uplode valid image'},400),false);
    }
}

const uplode = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})
exports.resizeUserPhoto = (req,res,next)=>{
    if(!req.file) return next();
    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500,500)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/imgs/${req.file.filename}`)
    next();
}
exports.uplodePhoto = uplode.single('photo');
exports.createUser = checkAsync(async (req,res)=>{
    // console.log(req.body)
    const createdUser = await User.create(req.body);
    createdUser.password=undefined;
    res.status(201).json({
        status:'success',
        data:{
            createdUser
        }
    })
    
})
exports.getAllUsers = checkAsync(async(req,res,next)=>{
    const queryModel = (new APIFeatures(User.find(),req.query)).filter().pagingAndLimiting().requireFields().sort();
    const users = await queryModel.query;
    res.status(200).json({
        status:'success',
        result:users.length,
        data:{
            users
        }
    })
})
exports.getUserById = checkAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})
const updateOptions = (req)=>{
    let reqB = req.body
    const query= {...reqB};
    const privcy = ['password','passwordConform','accountCreatedAt','friends','friendRequests','passwordChangedAt','passwordresetToken','passwordresetTokenExpiresIn'];
    privcy.forEach(ele=>{delete query[ele]});
    if(req.file){
        query.photo=`../imgs/${req.file.filename}`
    }
    // console.log(query);
    // if(reqB.)
    return query;

}
exports.updateMySelf = checkAsync(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.user.id,updateOptions(req),{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})
exports.updateUserById = checkAsync(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.id,updateOptions(req),{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})
exports.deleteUserById = checkAsync(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:'success',
        data:{
            user
        }
    })
})
exports.updatePassword = checkAsync(async(req,res,next)=>{
    const {password,newPassword,passwordConform}=req.body;
    if(!password || !newPassword || !passwordConform)
        return next(new AppError({message:"pls provide required fields"},403));
    if(!(await bcrypt.compare(password,req.user.password)))
        return next(new AppError({message:"Incorrect password or email"},401));
    req.user.password=newPassword,
    req.user.passwordConform=passwordConform
    await req.user.save();
    const token=sendJwt(req.user._id);
    setCookie(token,res,process.env.JWT_COOKIE_EXPIRE_TIME*24*60*60*1000)
    res.status(200).json({
        status:'success',
        message:'updated your password'
    })
})

exports.sendFriendRequest = checkAsync(async(req,res,next)=>{
    const {email} = req.body;
    let raisedErr=false
    if(!email)
        return next(new AppError({message:"pls send email of your friend"},400));
    const frndAccount = await User.findOne({email})
    if(frndAccount.id===req.user.id)
    try{
        const requests = frndAccount.friendRequests
        requests.forEach(ele=>{
            if(ele.id.equals(req.user._id)){
                raisedErr=true
                return next(new AppError({message:"request already sended"},400));
            }
        })
        if(!raisedErr){
            const friends = frndAccount.friends
            friends.forEach(ele=>{
                if(ele.id.equals(req.user._id)){
                    raisedErr=true
                    return next(new AppError({message:"you both are already friends"},400)); 
                }          
            })
        }
    }
    catch(err){
    
    }
    if(raisedErr)
        return 0;
    const frndUser = await User.findOneAndUpdate({email},{$push:{
        friendRequests:{
            id:req.user._id,
        }
    }});

    res.status(200).json({
        status:'success',
        message:'request send successfully'
    })
});
exports.sendFriendRequestById = checkAsync(async(req,res,next)=>{
    const userId  = req.body.id;
    // console.log(userId);
    if(userId===req.user.id)
        return next(new AppError({message:'not valid'},400))
    let raisedErr=false;
    try{
        const fredUser = await User.findById(userId);
        if(!fredUser){
            return next(new AppError({message:"not valid id"},400));
        }
        const requests = fredUser.friendRequests
        requests.forEach(ele=>{
            if(ele.id==req.user.id){
                raisedErr=true
                return next(new AppError({message:"request already sended"},400));
            }
        })
        if(!raisedErr){
            const friends = frndUser.friends
            friends.forEach(ele=>{
                if(ele.id==req.user.id){
                    raisedErr=true
                    return next(new AppError({message:"you both are already friends"},400)); 
                }          
            })
        }
    }catch(err){

    }
    if(raisedErr)
        return 0;
        const frndUser = await User.findByIdAndUpdate(userId,{$push:{
        friendRequests:{
            id:req.user.id,
        }
    }});

    res.status(200).json({
        status:'success',
        message:'request send successfully'
    })
})
exports.acceptFriendRequest = checkAsync(async(req,res,next)=>{
    let email;
    if(req.body.id){
        const frndUser = await User.findById(req.body.id)
        if(!frndUser)
            return next(new AppError({message:"in valid"},400));
        email=frndUser.email;
        
    }
    else{
        email = req.body.email;
    }
    let raiseSuc = false
    if(!req.body.id || !email)
        return next(new AppError({message:"pls send email of your friend"},400));
    const allRequest = req.user.friendRequests;
    let frndId;
    allRequest.forEach(ele=>{
        if(ele.id.email===email){
            raiseSuc=true;
            frndId=ele.id.id;
        }
    })
    if(!raiseSuc){
        res.status(404).json({
            status:'fail',
            message:'something went wrong'
        })
        return;
    }
    await User.findOneAndUpdate({_id:frndId},{$push:{
        friends:{
            id:req.user._id,
            // email:req.user.email,
        }
    }})   
    await User.findOneAndUpdate({_id:req.user._id},{$push:{
        friends:{
            id:frndId
        }
    },$pull:{
        friendRequests:{
            id:frndId
        }
    }})  
    res.status(200).json({
        status:'success',
        message:'may your friendship live a long'
    })
})