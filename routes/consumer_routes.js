const express = require('express');
const Router = express.Router();

// controllers

const ConsumerController=require('../controllers/consumer_controller');


Router.get('/receiveMessage',ConsumerController.receiveMessageFromSqs);
Router.get('/test',(req,res)=>res.send('Server apis are working just fine in 3002 port !'));




module.exports=Router;