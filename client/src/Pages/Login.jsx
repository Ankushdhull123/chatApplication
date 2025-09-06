import React, { useContext, useState } from 'react'
import './Login.css'
import {useNavigate} from 'react-router-dom'
import { MyContext } from '../Context';
import Nav from '../Components/Navbar';
import { toast } from 'react-toastify';


function Login() {
  const [email,setemail] = useState('');
  const [pass,setpass] = useState('');
  const nav = useNavigate()

  const {ManageLogindata,setshowcontacts,setlogindata} = useContext(MyContext)

function handleSubmit(e) {
  e.preventDefault();

  const userData = {
    email: email,
    password: pass,
  };

  console.log(userData);

  try {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {

        if(data.message==="Login successfull")
        {
          toast.success("Login Successful 👌");
              ManageLogindata(
          data.name,
          data.phone,
          data.email,
          data.description,
          data.id,
          data.img
        );
        
        setemail("");
        setpass("");

        // Navigate after delay
        setTimeout(() => {nav("/")
          setshowcontacts(true);
        }, 2500);
        
        }else{
            setlogindata({ name: null, phone: null, email: null, desc: null, id: null, img: null });

        // Show error toast immediately
        toast.error("Login Failed ❌");

        }
        
        // Save data
        
      })
      .catch((error) => {
        console.error("Error:", error);

        
         
      });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong ❌");
  }
}

  return (
    <div className='login'>
      <h1>Login</h1>
      <form>
  <input 
    type='email' 
    placeholder='Enter your email'
    value={email} 
    onChange={(e)=> setemail(e.target.value)} 
  />

  <input 
    type='password' 
    placeholder='Enter your password'
    value={pass} 
    onChange={(e)=> setpass(e.target.value)} 
  />

  <button type='submit' onClick={handleSubmit}>Login</button>

  <p className="signup-text">
    Not a user? <a onClick={()=> nav('/signup')}>Sign up</a>
  </p>
</form>
    </div>
  )
}

export default Login
