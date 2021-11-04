const authControllers = require('./authControllers')
const ejs = require('ejs');
// class response{
//     status(statusCode){
//         this.statusCode;
//         return this
//     }
//     json(obj){
//         this.jsonObj=obj
//     }
// }
const sendresponse='dont'
exports.login = async(req,res,next)=>{
    try{
        // console.log(req.body);
        const zxv = await authControllers.login(req,res,next,sendresponse);
        // console.log(res.statusCode);
        if(res.statusCode===200)
            res.render('main');
        else    
            res.render('base',{file:'log in'})
    }catch(err){
        
    }
}