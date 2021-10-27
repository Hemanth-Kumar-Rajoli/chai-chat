const express = require('express')
const ejs = require('ejs');
const authControllers = require('../Controlls/authControllers');
const app =express();
const router = express.Router()


console.log(`${__dirname}/../views`);
router.route('/login').get((req,res)=>{
    res.render('base',{file:'log in'})
})

router.route('/signup').get((req,res)=>{
    res.render('base',{file:'sign up'})
})
router.route('/forgot-password').get((req,res)=>{
    res.render('base',{file:'forgot password'})
})
// router.use()
router.route('/about-me').get(authControllers.protect,(req,res)=>{
    res.render('profile',{user:req.user})
})
router.route('/').get(authControllers.protect,(req,res)=>{
    res.render('main',{user:req.user});
})
module.exports=router