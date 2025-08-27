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
       <p onClick={()=> navigate('/login')}>Login</p>

       <p onClick={()=> navigate('/signup')}>Sign Up</p>

      </div>) : ''
      }
      {
         logindata.name ? (<div className='profileandnotification'>
          <div className='room'>
            <img src={images.room} alt='room' onClick={()=> navigate('/allrooms')}/>
          </div>
          <div className="notificationbox">
            <img src={images.notification} alt='notification' onClick={()=> navigate('/notification')}/>
          </div>
          <div className="userprofile">
            <p onClick={()=> {
              if(showcontacts && screensize<480) 
              {
                setshowcontacts(false)
              }
              navigate('/dash')}}>Hello {logindata.name}</p>
          </div>

          
          </div>) : ''
      }
      
    </div>
  );
};

export default Nav;
