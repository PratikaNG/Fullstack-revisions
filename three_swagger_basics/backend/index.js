const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const fs = require('fs')
const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const file = fs.readFileSync("./swagger.yaml",'utf-8')
const swaggerDocument = YAML.parse(file)
const fileUpload = require('express-fileupload')
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
app.use(express.json())  //acts as default bodyParser
app.use(fileUpload())
app.listen(PORT,()=>{console.log(`Server is listening to: ${PORT}`)})

let subjects = [
    {
        subject_name:"Social",
        id:"12",
    },
    {
        subject_name:"Science",
        id:"13",
    },
]
app.get('/api/v1',(req,res)=>{
    res.status(200).send("All subjects")
})
app.get('/api/v1/subjects',(req,res)=>{
    res.status(200).send(subjects)
})
app.get('/api/v1/subject',(req,res)=>{
    res.status(200).send({
        subject_name:"Social",
        id:"12",
    },)
})

// params
app.get('/api/v1/mainSubject/:subjectId',(req,res)=>{
    const foundSubj = subjects.find(subj => subj.id === req.params.subjectId)
    console.log("foundSubj",foundSubj)
    res.send(foundSubj)
})

// post
app.post('/api/v1/addSubject',(req,res)=>{
    const data = req.body
    console.log("Data being posted: ",data)
    res.send(true)
})

// query
app.get('/api/v1/subjectquery',(req,res)=>{
    const activity_type = req.query.activity_type
    const activity_day = req.query.activity_day
    res.send({activity_day,activity_type})  
    console.log("checking req.query: ",req.query)
})

// file upload -> npm i express-fileupload
app.post('/api/v1/subject_file_upload',(req,res)=>{
    console.log("req headers: ",req.headers)
    const file = req.files.file
    console.log("fileschecking",file)
    let path = __dirname + "/images" + Date.now() + ".jpg"
    console.log("filepath check",path)
    file.mv(path,(err)=>{  //callback function here is to handle err if any, otherwise it will directly move the file to the path provided
        if(err){
            console.log("err")
            res.send(false)
        }else res.send(true)
    })

})

