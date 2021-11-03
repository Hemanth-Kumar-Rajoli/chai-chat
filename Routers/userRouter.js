const express = require('express');
const router = express.Router();
const  userController = require('./../Controlls/userControllers');
const authController = require('../Controlls/authControllers');
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPasssword);
//---------------------------------------------------------------------------------
router.use(authController.protect)
//------------------user-to-be-loged-in-access-to-this-routes-----------------------

router.route('/logout').get(authController.logOut);
router.route('/update-password').patch(userController.updatePassword)
// router.route('/deletemyAccount')
router.route('/sendFriendRequest').post(userController.sendFriendRequest)
router.route('/sendFriendRequestById').post(userController.sendFriendRequestById)
router.route('/acceptFriendRequest').post(userController.acceptFriendRequest)
router.route('/updateMySelf').patch(authController.protect,userController.uplodePhoto,userController.resizeUserPhoto,userController.updateMySelf)
router
    .route('/')
    .post(userController.createUser)
    .get(userController.getAllUsers)
router
    .route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUserById)
    .delete(authController.ristrictedTo,userController.deleteUserById)

module.exports = router;