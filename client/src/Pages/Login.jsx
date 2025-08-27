import React, { useContext, useState } from 'react'
import './Login.css'
import {useNavigate} from 'react-router-dom'
import { MyContext } from '../Context';


function Login() {
  const [email,setemail] = useState('');
  const [pass,setpass] = useState('');
  const nav = useNavigate()

  const {ManageLogindata,setshowcontacts} = useContext(MyContext)

  function handleSubmit(e){
    e.preventDefault()
 
    const userData = {
    
     email:email,
     password:pass
    }
    console.log(userData)
 
    try {
     fetch('http://localhost:5000/login', {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify(userData) , 
         credentials: "include"
     })
     .then(response => response.json())
     .then(data => {
         console.log('Success:', data);
         ManageLogindata(data.name,data.phone,data.email,data.description,data.id)
         setshowcontacts(true)
         setemail('')
         setpass('')
         nav('/')
         
         
     })
     .catch(error => {
         console.error('Error:', error);
     });
 } catch (error) {
     console.log(error);
 }
    
   }
  return (
    <div className='login'>
      <h1>Login</h1>
      <form>
        Email : <input type='email'value={email} onChange={(e)=>{
          setemail(e.target.value)
        }}></input>
        Password : <input type='password'value={pass} onChange={(e)=>{
          setpass(e.target.value)
        }}></input>
        <button type='submit' onClick={(e)=>{
          handleSubmit(e)
        }}>Login </button>
      </form>
    </div>
  )
}

export default Login
