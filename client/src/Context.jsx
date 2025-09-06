import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
// 1. Create the context
export const MyContext = createContext();

// 2. Create the provider component
export const MyProvider = ({ children }) => {
  
    const [logindata,setlogindata] = useState({name:null,phone:null,email:null,desc:null,id:null,img:null})
    const [socket,setsocket] = useState(null)
    const [contacts,setContacts] = useState([])
    const [showcontacts,setshowcontacts] = useState(true)

    const [followings, setFollowings] = useState([]);
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
    useEffect(()=>{
        var x = JSON.parse(localStorage.getItem('userdata'))

        if(x!==null)
        {
            setlogindata(x)
        }else{
            setlogindata({name:null,phone:null,email:null,desc:null,id:null,img:null})
            setshowcontacts(false)
        }

    },[])

    useEffect(()=>{
      var x= io('http://localhost:5000');

      if(logindata.name!==null)
      {
        console.log(logindata.name)
        x.emit('userjoined',logindata.name)
      }

      setsocket(x)


      
    },[logindata.name])
    console.log('socket',socket)

    function ManageLogindata(name,phone,email,desc,id,img)
    {
        setlogindata({name:name,phone:phone,email:email,desc:desc,id:id,img:img})

        localStorage.setItem('userdata',JSON.stringify({name:name,phone:phone,email:email,desc:desc,id:id,img:img}))
    }

    useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:5000/allusers');
        const data = await res.json(); // convert response to JSON
        setContacts(data); // store the contacts in state
        console.log('contacts',data)
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    }

    fetchData();
  }, []);

 useEffect(() => {
  const fetchFollowings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/user/${logindata.id}/followings`);
      if (!res.ok) {
        throw new Error("Failed to fetch followings");
      }
      const data = await res.json();
      console.log("Followings:", data);
      setFollowings(data); // ✅ directly set data (it's already an array)
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };

  if (logindata.id) {
    fetchFollowings();
  }
}, [logindata.id]);


  console.log('followings',followings)

  return (
    <MyContext.Provider value={{screensize, setScreensize,contacts,setContacts,ManageLogindata,logindata ,socket,setlogindata,showcontacts,setshowcontacts}}>
      {children}
    </MyContext.Provider>
  );
};