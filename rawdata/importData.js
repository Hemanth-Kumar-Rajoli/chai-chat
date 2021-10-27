const dotenv = require("dotenv");
const fs = require('fs')
const mongoose = require("mongoose");
const User = require('../models/userSchema');
dotenv.config({path:`./config.env`});
console.log("../config.env");
// console.log(`${__dirname}`);

const user = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`,"utf-8"));

// console.log(tour);
console.log(process.env.MONGODB_DATABASE);
const DB = process.env.MONGODB_DATABASE.replace("<PASSWORD>",process.env.MONGODB_USER_PASSWORD);//creating uri

//connecting to the mongodb server
mongoose.connect(DB).then(con=>{
    console.log("your are now connected to the server");
}).catch(err=>console.log(err))

//importing data
const insertData = async ()=>{
    try{
        await User.create(user);
        console.log("data successfully loaded");
    }catch(err){
        console.log(err);
    }
    process.exit();
}
//deleting all data in db
const deleteData = async ()=>{
    try{
        await User.deleteMany();
        console.log("data successfully deleted");
    }catch(err){
        console.log(err);
    }
    process.exit();
}
if(process.argv[2]=="--import"){
    insertData();
}else if(process.argv[2]=="--delete"){
    deleteData();
}
// console.log(process.env);
