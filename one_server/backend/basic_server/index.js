require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
app.get('/',(req,res)=>{
    res.send("Welcome Home")
})

app.get('/api/about',(req,res)=>{
    const locations = [
        {name:"AB nagar",
          population:"2k"
        },
        {name:"BC nagar",
          population:"2.6k"
        }
      ]
    res.send(locations)
})

app.get('/contact',(req,res)=>{
    res.send("Contact us")
})

app.listen(port,()=>{
    console.log(`Listening on port: ${port}`)
})