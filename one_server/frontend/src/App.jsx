import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [locations, setLocations] = useState([])
  

  useEffect(()=>{
    axios.get("/api/about")
    .then((res)=>{console.log("res",res)
      setLocations(res.data)}
    )
    .catch((err)=>console.log("err",err))
  },[])

  return (
    <>
    <h1>Locations</h1>
    {locations.map((item,index)=>{
      return (<>
      <h3>{item.name}</h3>
      <p>{item.population}</p>
      </>)
    })}
    </>
  )
}

export default App
