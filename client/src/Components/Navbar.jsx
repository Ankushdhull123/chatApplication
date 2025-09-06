import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Nav.css'
import { MyContext } from '../Context';
import { images } from '../Assets/Images';

const Nav = () => {
  const navigate = useNavigate()
  const {logindata,showcontacts, setshowcontacts,screensize, setScreensize,} = useContext(MyContext)
  const imgsrc = null
  return (
    <div className="nav">
      {
        /*<ul>
        <img src={images.messenger} alt='logo'/>
 
        <div className={!logindata.name ? 'loginsignup' : 'none'}>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </div>
        
        <img src={images.notification} alt='notification' onClick={()=> navigate('/notification')}/>
        <div className={logindata.name ? '' : 'none'}>
          
          <li onClick={()=> navigate('/dash')}>
            
              Hello, {logindata.name}
            
            <img src={imgsrc===null ? images.noprofile : imgsrc} alt="error" />
          </li>
        </div>
      </ul> */
      }
      <div className="logo" onClick={()=> {
        if(showcontacts===false && screensize<480)
        {
          setshowcontacts(true)
        }
        navigate('/')
      }
        
        }>
        <img src={images.messenger} alt='logo'/>
      </div>
      {
        !logindata.name ? (<div className="right">
       

       <button style={{height:'32px',width:'100px',backgroundColor:'green',color:'white',border:'none',borderRadius:'5px'}}onClick={()=> navigate('/signup')}>Register</button>

      </div>) : ''
      }
      {
         logindata.name ? (<div className='profileandnotification'>
          <div className='room'>
            <img src={images.room} alt='room' onClick={()=> {
              screensize < 480 && showcontacts ? setshowcontacts(false): setshowcontacts(true)
              navigate('/allrooms')}}/>
          </div>
          
          <div className="userprofile">
            <button style={{height:'32px',width:'auto',backgroundColor:'green',color:'white',border:'none',borderRadius:'5px'}}onClick={()=> {
              if(showcontacts && screensize<480) 
              {
                setshowcontacts(false)
              }

              navigate('/dash')}}>Hello {logindata.name}</button>
          </div>

          
          </div>) : ''
      }
      
    </div>
  );
};

export default Nav;
