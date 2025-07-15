import { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const navigate = useNavigate()
const [formValues, setFormValues] = useState({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
});
  const handleChange=(e)=>{
    const {name,value} = e.target
    setFormValues((prev)=>({
      ...prev,[name]:value
    }))
  }
 
  function handleSignup(e){
    e.preventDefault()
   console.log("formValues",formValues)
    
    // const checkIfUserExists = users.filter((item)=>item.user_name === username && item.password === userPassword)
    // console.log("checkIfUserExists",checkIfUserExists)
    // if(checkIfUserExists.length > 0){
    //   alert("user already exists")
    //   navigate("/")
    // }
    // else{ alert("signing in")
    //   navigate("/user")
    // }
    axios.post('/register',formValues)
    .then((res)=>{console.log("res",res)
        alert("signing in")
       navigate("/user")
    })
    .catch((err)=>{console.log("err",err.response.data)
      alert(err.response.data)
    })
  }
  return (
    <div className="signup-container">
      <form className='signup-form' onChange={handleChange}>
        <div className="form-item" >
        <p className="input-label">Firstname</p>
        <input className="input-value" name='firstname' type='text' placeholder='Enter the firstname' ></input>
        </div>
        <div className="form-item">
        <p className="input-label">Lastname</p>
        <input className="input-value" name='lastname' type='text' placeholder='Enter the lastname'></input>
      </div>
        <div className="form-item">
        <p className="input-label">Email</p>
        <input className="input-value" name='email' type='email' placeholder='Enter the email'></input>
        </div>
        <div className="form-item">
        <p className="input-label">Password</p>
        <input className="input-value" name='password' type='text' placeholder='Enter the password'></input>
      </div>
      <div className="form-item">
      <button onClick={(e)=>{handleSignup(e)}} className='action-button'>Sign Up</button></div>
      </form>
    </div>
  );
}

export default App;
