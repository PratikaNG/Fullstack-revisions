const express = require('express')
require('dotenv').config()
const app = express()
const fileupload = require('express-fileupload')
// using ejs -> ejs comes as a part of middleware and it uses view engine, hence we will set the view engine as below
app.set('view engine','ejs')
// Now it expects a "views" directory if we have to use the view engine and ejs
// Create the ejs files in views directory and render it her
const cloudinary = require("cloudinary").v2


// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:"true"})) 
//{extended:"true"} -> handles everything thats extended in data {"fullname":{"firstname":"pratika","lastname":"ng"}}
app.use(fileupload(
    {
        useTempFiles:true,  //turn this flag on
        tempFileDir:"/tmp/"  //create a tmp directory
    }
)) //for fileupload 

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.get('/myget',(req,res)=>{
    console.log("req.body: ",req.body)
    console.log("req.query: ",req.query)
    res.status(200).json(req.query)
    // if its a template engine like ejs then the data is sent in the query -> currently we are using ejs hence it will be req.query
    // if it other frontend framework like react,angular etc the data is sent in the body -> this should how the data should be sent ideally
    // res.status(200).json(req.body)
})

// file handling -> refer https://developer.mozilla.org/en-US/docs/Web/API/FileReader/FileReader
app.post('/mypost',async(req,res)=>{
    console.log("req.body: ",req.body)
    // console.log("req.query: ",req.query)
    console.log("req.files: ",req.files)
    // res.status(200).json(req.body)
    // in app.post request the req.body works correctly unlike app.get



    
    // 1. refer to cloundinary api syntax using below url
    // https://cloudinary.com/documentation/image_upload_api_reference#signed_upload_syntax
    // 2. Go to cloudinary account -> https://console.cloudinary.com/
    // 3. Go to Assets -> Media library -> Add a folder,ex: users
    // 4. access the file being uploaded from the form -> const file = req.files.samplefile
    // 5. it is req.files.samplefile because the name of the input is "samplefile" in the post form. 
    // 6. Once you upload the file to cloudinary, the "result" is expected
    // 7. cloudinary.v2.uploader.upload(file, options).then(callback);  --> syntax
    
    // simple use case for single image upload 
    // let file = req.files.samplefile
    // result = await cloudinary.uploader.upload(file.tempFilePath,{
    //     folder:"users"
    // })
    // console.log("Cloudinary result",result)

    // multiple files upload
    let result;
    let imagesArray = []
    if(req.files){
        for (let index = 0; index < req.files.samplefile.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath,{
                folder:"users"
            })
            imagesArray.push({
                public_id:result.public_id,
                secure_url:result.secure_url
            })
        }
    }

    console.log("result",result)
    
    details = {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        result,
        imagesArray
    }
    console.log("details",details)

    res.status(200).send(details)
    
})



//rendering getForm.ejs
app.get("/mygetform",(req,res)=>{
    res.render('getForm')  //by default it looks into views folder hence mention the file to be rendered.
})

//rendering postForm.ejs
app.get("/mypostform",(req,res)=>{
    res.render('postForm')  //by default it looks into views folder hence mention the file to be rendered.
})





app.listen(4000,()=>{console.log("App is listening to port 4000")})


// Errors handled during file upload using cloudinary
// 1.Error: Must supply api_key 
// solution:
// cloudinary.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUD_API_SECRET
// })
// 2.TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received an instance of Object
// solution:
//     a. Make sure options are given to the fileupload
//         app.use(fileupload(
//             {
//                 useTempFiles: true,
//                 tempFileDir: "/tmp/"
//             }
//         ))
//     b.Make sure you give the "tempFilePath" to the file
//         const result = cloudinary.uploader.upload(file.tempFilePath, {
//             folder: "Users"
//         })
