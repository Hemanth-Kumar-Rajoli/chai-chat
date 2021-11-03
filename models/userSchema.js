const mongoose = require('mongoose');
const validator = require('validator');//it is used for checking the email types
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    //implemented filds {mail,photo,accountCreatedAt,password,passwordConform}
    name:{
        type:String,
        required:[true,'a user must have a name'],
    },
    email:{
        type:String,
        required:[true,'a user must have an email'],
        unique:true,
        validate:[validator.isEmail,'pls provide valid email']
    },
    photo:{
        type:String,
        default:'../imgs/default.jpg'
    },
    DateOfBirth:Date,
    accountCreatedAt:{
        type:Date,
        default:Date.now
    },
    aboutMe:{
        type:String,
        default:""
    },
    password:{
        type:String,
        required:[true,'must provide password'],
        minlength:8
    },
    friends:[
        {
            id:{
                type:mongoose.Schema.ObjectId,
                ref:'user',
            },
            unReadMessages:{
                type:Number,
                default:0
            }
        }
    ],
    friendRequests:[
        {
            id:{
                type:mongoose.Schema.ObjectId,
                ref:'user',
            },
            noOfUnreadMessages:{
                type:Number,
                default:0
            }
        }
    ],
    passwordConform:{
        type:String,
        required:[true,'must need to verify the password'],
        validate:{
            //this only works for create and save take care of others by saving
            validator:function(val){
                return val===this.password
            }
        },
        message:"password must be same"
    },
    passwordChangedAt:Date,
    passwordresetToken:String,
    passwordresetTokenExpiresIn:String,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.passwordConform=undefined,
    this.password=await bcrypt.hash(this.password,12);
    if(this.isNew) return next()
    this.passwordChangedAt=Date.now();
    next();
})
userSchema.methods.changedPasswordsAfterTokenIssued = function(JwtTimeStamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JwtTimeStamp < changedTimeStamp
    }
    //false means there is no changed since token is generated
    return false;
}
userSchema.virtual('age').get(function(){
    const birthDate = new Date(this.DateOfBirth);
    let years = (new Date()).getFullYear()-birthDate.getFullYear();
    const months = (new Date()).getMonth()-birthDate.getMonth();
    const date = (new Date()).getDate()-birthDate.getDate();
    if(!(date>=0 && months>=0))
        years--;
    return years;
})
const User = mongoose.model('user',userSchema);

module.exports = User;