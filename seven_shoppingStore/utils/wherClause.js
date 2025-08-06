//search=coder&page=2&category=hoodies&rating[gte]=4  -> example bigQ(big query)
// base - Product.find()

class WhereClause{
    constructor(base,bigQ){
        this.base = base;
        this.bigQ = bigQ
    }

    // search functionality
    search(){
        // const searchWord = this.bigQ.search ? {do something} :{do something}
        const searchWord = this.bigQ.search ? {
            name: {
                $regex :this.bigQ.search,
                $options : 'i'
            }
        } :{}

        this.base = this.base.find({...searchWord});
        return this;  //returns the entire context
    }

    // pagination functionality
    pager(resultPerPage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page;
        }
        // calculate how many values to skip
        const skipVal = resultPerPage * (currentPage - 1)  //standard formula for pagination
       
        this.base = this.base.limit(resultPerPage).skip(skipVal);
        return this;
    }

    // filter functionality
    filter(){
        // 1. have a copy of bigQ since we will be manipulating it into json,string etc later.
        const copyQ = {...this.bigQ}; //keep whatever existing values are in bigQ
        // 2. remove few fields -> search,limit,page
        delete copyQ["search"]
        delete copyQ["limit"]
        delete copyQ["page"]
        // 3. user regex to inject $ in place of gte,lte etc => 
            // a. convert bigQ into a string
            let stringOfCopyQ = JSON.stringify(copyQ);
            // b. run a reqex through that. ->
            //  \b implies boundary or exact match, 
            // /g implies global
            // m => `$${m}` implies for every item found relace it with $item
            stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);
            // c. conver this string to json
            let jsonOfCopyQ = JSON.parse(stringOfCopyQ);

            this.base = this.base.find(jsonOfCopyQ);
            return this;
    }
}

module.exports = WhereClause;



// search and pagination syntax
// class WhereClause{
//     constructor(base,bigQ){
//         this.base = base;
//         this.bigQ = bigQ
//     }

//     // search functionality
//     search(){
//         // const searchWord = this.bigQ.search ? {do something} :{do something}
//         const searchWord = this.bigQ.search ? {
//             name: {
//                 $regex :this.bigQ.search,
//                 $options : 'i'
//             }
//         } :{}

//         this.base = this.base.find({...searchWord});
//         return this;  //returns the entire context
//     }

//     // pagination functionality
//     pager(resultPerPage){
//         let currentPage = 1;
//         if(this.bigQ.page){
//             currentPage = this.bigQ.page;
//         }
//         // calculate how many values to skip
//         const skipVal = resultPerPage * (currentPage - 1)  //standard formula for pagination
       
//         this.base = this.base.limit(resultPerPage).skip(skipVal);
//         return this;
//     }
// }