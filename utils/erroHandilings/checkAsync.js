const AppError = require('./appErrorController');

module.exports = (fs)=>{
    return (req,res,next)=>{
        fs(req,res,next).catch((err)=>next(new AppError(err,400)))
    }
}