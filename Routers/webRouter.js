const express = require('express')
const ejs = require('ejs');
const authControllers = require('../Controlls/authControllers');
const User = require('../models/userSchema');
const app =express();
const router = express.Router()


// console.log(`${__dirname}/../views`);
router.route('/login').get((req,res)=>{
    res.render('base',{file:'log in'})
})

router.route('/signup').get((req,res)=>{
    res.render('base',{file:'sign up'})
})
router.route('/forgot-password').get((req,res)=>{
    res.render('base',{file:'forgot password'})
})
router.route('/reset-password/:token').get((req,res)=>{
    res.render('base',{file:'reset password'})
})
// router.use()
router.route('/about-me').get(authControllers.protect,(req,res)=>{
    res.render('profile',{user:req.user})
})
router.route('/get-more/:fid').get(authControllers.protect,async(req,res)=>{
    // console.log('enterred');
    try{
        const frdUser = await User.findById(req.params.fid);
        res.render('aboutFriends',{user:frdUser,adminUser:req.user})
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:'bad request'+err
        })
    }
})
router.route('/allFriendRequests').get(authControllers.protect,(req,res)=>{
    res.render('acceptingPage',{users:req.user.friendRequests})
})
router.route('/').get(authControllers.protect,(req,res)=>{
    res.render('main',{user:req.user});
})

module.exports=router