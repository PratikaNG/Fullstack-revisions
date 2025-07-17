const express = require('express')
const app = express()

// using ejs -> ejs comes as a part of middleware and it uses view engine, hence we will set the view engine as below
app.set('view engine','ejs')
// Now it expects a "views" directory if we have to use the view engine and ejs
// Create the ejs files in views directory and render it her

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:"true"})) 
//{extended:"true"} -> handles everything thats extended in data {"fullname":{"firstname":"pratika","lastname":"ng"}}

app.get('/myget',(req,res)=>{
    console.log("req.body: ",req.body)
    console.log("req.query: ",req.query)
    res.status(200).json(req.query)
    // if its a template engine like ejs then the data is sent in the query -> currently we are using ejs hence it will be req.query
    // if it other frontend framework like react,angular etc the data is sent in the body -> this should how the data should be sent ideally
    // res.status(200).json(req.body)
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