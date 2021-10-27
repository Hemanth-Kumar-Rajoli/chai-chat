const express = require('express');
const messageContoller = require('../Controlls/messageControllers');
const authController = require('../Controlls/authControllers');
const router = express.Router();
//sender/:sId/resiver/:rId',WithSenderResiverIds
router.use(authController.protect)

router
    .route('/')
    .get(messageContoller.getAllMessage)
    .post(messageContoller.createMessage)
module.exports = router