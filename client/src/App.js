import logo from './logo.svg';
import './App.css';
import Nav from './Components/Navbar';
import {Routes,Route} from 'react-router-dom'
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Contacts from './Components/Contacts';
import Chat from './Pages/Chat';
import DashBoard from './Pages/DashBoard';
import Notification from './Pages/Notification';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './Context';
import GroupPage from './Pages/GroupPage';
import AvailableRooms from './Pages/AvailableRooms';
import RoomPage from './Pages/RoomPage';
import { ToastContainer } from 'react-toastify';

function App() {
  const {logindata,showcontacts} = useContext(MyContext)
  const [screensize, setScreensize] = useState(window.innerWidth);

    
        useEffect(() => {
          const handleResize = () => {
            setScreensize(window.innerWidth);
          };
      
          window.addEventListener("resize", handleResize);
      
          return () => {
            window.removeEventListener("resize", handleResize);
          };
        }, []);
  return (
    <div className='app'>
      
      
      <Nav/>
      
      <div className='container'>
        <ToastContainer />
        
        {
               logindata.name !==null && showcontacts? <Contacts/> : ''
        }

        {
          showcontacts && screensize<480 ? '' : (
            <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/dash' element={<DashBoard/>}/>
          <Route path='/notification' element={<Notification/>}/>
          <Route path='/group' element={<GroupPage/>}/>
          <Route path='/allrooms' element={<AvailableRooms/>}/>
          <Route path='/room' element={<RoomPage/>}/>
        </Routes>

          )
        }
        

        
      </div>
    </div>
  );
}

export default App;
