class APIFeatures{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }
    filter(){
        const quaryObject = {...this.querystr};
        const excludeFields = ["page","sort","limit","fields"];
        excludeFields.forEach(ele=>{delete quaryObject[ele]});
        if(quaryObject.regex){
            this.query=this.query.find({name:{$regex:new RegExp(`${quaryObject.regex}`),$options: 'i'},accountCreatedAt:{$lt:quaryObject.timeOfSearchStart}});
            return this
        }
        //advance filtering
        let querystring = JSON.stringify(quaryObject);
        querystring=querystring.replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`);

        // console.log(req.query,quaryObject);
        // console.log((JSON.parse(JSON.parse(querystring).name)));
        // if(querystring.includes('$regex')){
        //     // querystring = {"name":{$regex:"he."}};
        //     // console.log(JSON.parse(querystring).name);
        //     // console.log();
        //     this.query=this.query.find(JSON.parse({name:"hemanth"}));
        //     return this
        // }
        console.log(JSON.parse(querystring));
        this.query=this.query.find(JSON.parse(querystring));
        // let query =this.query.find(JSON.parse(querystr));
        return this;
    }
    sort(){
        if(this.querystr.sort){
            //if there is a tie then we need order them according to orther field so,,,
            const sortFields = this.querystr.sort.split(",").join(" ");
            this.query=this.query.sort(sortFields);
        }else{
            this.query=this.query.sort("-accountCreatedAt");
        }
        return this;
    }
    requireFields(){
        if(this.querystr.fields){
            const requiredFields = this.querystr.fields.split(",").join(" ");
            this.query=this.query.select(requiredFields);
        }else{
            this.query=this.query.select("-__v");
        }
        return this;
    }
    pagingAndLimiting(){
        const page = this.querystr.page*1 || 1;
        const limit = this.querystr.limit*1 || 100;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        // if(this.querystr.page){
        //     const numOfTours = await Tour.countDocuments();
        //     if(skip>=numOfTours) throw new Error("This page does not exist");
        // }
        return this;
    }
}
module.exports=APIFeatures;