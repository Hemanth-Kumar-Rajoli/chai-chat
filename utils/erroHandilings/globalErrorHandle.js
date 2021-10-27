module.exports=(err,req,res,next)=>{
    console.log(err.stack);
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })
}