module.exports=class AppError extends Error{
    constructor(err,statusCode){
        super(err.message)
        // this.message=;
        this.statusCode=statusCode;
        this.status=(statusCode>=400)?'fail':'internallError'
        Error.captureStackTrace(this,this.constructor)
    }
}