const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

app.listen(PORT,console.log(`Server is listening at: ${PORT}`))

app.get('/',(req,res)=>{
    res.send("Welcome ")
})

app.get('/api/v1/students',(req,res)=>{
    const students = {
        count:100,
        present:60,
        absent:30,
    }
    res.status(200).json(students)
    // res.status(200).json({students})
})
app.get('/api/v1/faculties',(req,res)=>{
    const faculties = {
        count:50,
        present:45,
        absent:5,
    }
    res.status(200).json(faculties)
    // res.status(200).json({faculties})
})
app.get('/api/v1/:token',(req,res)=>{
    // can name the param anything, this is to handle params
    // consoling the param below 
    // res.status(200).send(req.params.token)
    res.status(200).json({param:req.params.token})
})