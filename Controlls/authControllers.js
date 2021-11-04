const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AppError = require("../utils/erroHandilings/appErrorController");
const APIFeatures = require('./../utils/apiFeatures');
const checkAsync = require('../utils/erroHandilings/checkAsync');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/email');
const ejs = require('ejs')
const crypto = require('crypto');
const { promisify } = require('util');
dotenv.config({path:"./config.env"});
const sendJwt = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}
exports.sendJwt=sendJwt;
const setCookie = (token,res,req,expireTime)=>{
    const cookieOptions = {
        expires:new Date(Date.now()+expireTime),
        httpOnly:true,
        secure: req.secure || req.headers['x-forwarded-proto']==='https'
    }
    res.cookie('jwt',token,cookieOptions);
}
exports.setCookie=setCookie;

exports.signup = checkAsync(async(req,res,next)=>{
    const createdUser = await User.create(req.body);
    const token = sendJwt(createdUser._id);
    setCookie(token,res,req,process.env.JWT_COOKIE_EXPIRE_TIME*24*60*60*1000);
    createdUser.password=undefined;

    res.status(201).json({
        status:'success',
        token,
        data:{
            createdUser
        }
    })
})
exports.login = checkAsync(async(req,res,next)=>{
    const {password,email} = req.body;
    if(!password || !email)
        return next(new AppError({message:"provide password and email"},401))
    const user = await User.findOne({email});
    if(!user) 
        return next(new AppError({message:"provide password and email"},401))
    if(!(await bcrypt.compare(password,user.password)))
        return next(new AppError({message:"Incorrect password or email"},401))
    const token =sendJwt(user._id);
    setCookie(token,res,req,process.env.JWT_COOKIE_EXPIRE_TIME*24*60*60*1000);
    res.status(200).json({
        status:'success',
        token,
        message:'successfully logedin '
    
    })

})
exports.forgotPassword = checkAsync(async(req,res,next)=>{
    const {email} = req.body;
    if(!email)
        return next(new AppError({message:"pls provide email"},401));
    const user = await User.findOne({email});
    if(!user)
        return next(new AppError({message:"pls provide valid email"},401));
    const resetToken = crypto.randomBytes(32).toString('hex');
    const url=`${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
    const message=`forgot password? send post request to \n${url}\n if not pls ignore this mail`
    try{
        const html = await ejs.renderFile(`${__dirname}/../views/emailTemplete.ejs`,{forgotPassUrl:url,webUrl:`${req.protocol}://${req.get('host')}/reset-password/${resetToken}`,host:`${req.protocol}://${req.get('host')}`})
        await sendEmail({
            message,
            email:user.email,
            subject:`This url is valid only for ${process.env.PASSWORD_RESET_TOKEN_EXPIRESIN} miniutes only`,
            html
        });
        user.passwordresetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordresetTokenExpiresIn=Date.now()+process.env.PASSWORD_RESET_TOKEN_EXPIRESIN*60*1000;
        await user.save({validateBeforeSave:false});
        res.status(200).json({
            status:'success',
            message:'reset url is send to email pls check your mail'
        })
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:'something went wrong.Try again'
        })
        console.log(err);
    }
})
exports.resetPasssword = checkAsync(async(req,res,next)=>{
    const {token} = req.params;
    const {newPassword,conformPassword}=req.body;
    if(!newPassword || !conformPassword)
        return next(new AppError({message:"pls provide newPassword and conformPassword"},401));
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({passwordresetToken:resetToken,passwordresetTokenExpiresIn:{$gt:Date.now()}});
    user.password=newPassword;
    user.passwordConform=conformPassword;
    user.passwordresetToken=undefined,
    user.passwordresetTokenExpiresIn=undefined,
    await user.save();
    user.password=undefined;
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
    
})
exports.logOut = checkAsync(async(req,res,next)=>{
    setCookie('hello',res,req,10);
    res.status(200).json({
        status:'success',
        message:'you are successfully loged out'
    })
})
exports.protect = checkAsync(async(req,res,next)=>{
    //1)check the token
    const jwtTokenCookie = req.headers.cookie;
    if(!jwtTokenCookie){
        return res.redirect('/login')
        // return next(new AppError({message:"you are not loged in"},401));
    }
    const jwtToken = jwtTokenCookie.slice(4,jwtTokenCookie.length)
    // console.log(jwtToken);
    //2)verify the token
    const decode = await promisify(jwt.verify)(jwtToken,process.env.JWT_SECRET);
    //3)check user still exits on db
    const user =await User.findOne({_id:decode.id}).populate({
        path:'friends.id',
        select:'name email photo'
    }).populate({
        path:'friendRequests.id',
        select:'name email photo aboutMe DateOfBirth'
    });
    if(!user)
        return next(new AppError({message:"you are loged out"},401));
    //4)check the user changed the password after token is issued
    if(user.changedPasswordsAfterTokenIssued(decode.iat))
        return next(new AppError({message:"you changed your password"},401));
    req.user=user;
    next();
})
exports.ristrictedTo = checkAsync(async(req,res,next)=>{
    if(req.user.role && !req.user.role==='admin')
        return next(new AppError({message:"you are not allowed to do this actoin"},401));
    next();
})