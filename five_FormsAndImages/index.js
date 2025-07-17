const express = require('express')
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:"true"})) 
//{extended:"true"} -> handles everything thats extended in data {"fullname":{"firstname":"pratika","lastname":"ng"}}

app.get('/myget',(req,res)=>{
    console.log("req.body: ",req.body)
    res.status(200).json(req.body)
})



app.listen(4000,()=>{console.log("App is listening to port 4000")})