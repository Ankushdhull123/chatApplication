import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MyContext } from '../Context';
import { images } from '../Assets/Images';
import './GroupPage.css'

function RoomPage() {
   const navigate = useNavigate()
    const location = useLocation();
    const [showinvitebox,setshowinvitebox] = useState(false)
    const [message,setmessage] = useState('')
    const {logindata,socket,contacts,screensize} = useContext(MyContext)
    const { groupid,name, profile,members ,createdBy} = location.state || {};
    console.log('members',members)
    const [allchats,setallchats] = useState([])
    const [userjoined,setuserjoined]= useState([])

     

    function sendMessage() {
  if (!message.trim()) return;

  const obj = { groupId: groupid, message: message, sender: logindata.name,senderimg:logindata.img,time:Date() };

 
  setallchats((prev) => [...prev, obj]);
  setmessage("");

  socket.emit("sendMessage", obj);

}

  console.log('all group chats',allchats)
   useEffect(() => {
  const handler = (msg) => {
    if (msg.groupId === groupid && msg.sender!==logindata.name) {
      setallchats((prev) => [...prev, msg]);
      
    }
  };

  socket.on('receiveMessage', handler);


  return () => {
    socket.off('receiveMessage', handler);
  };
}, [socket]);


    useEffect(()=>{

        socket.emit('joinroom',{roomid:groupid,name:logindata.name})

    },[groupid,socket])

    async function addtogroup(name) {
  try {
    const res = await fetch("http://localhost:5000/addmembertogroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: groupid,   // from location.state
        memberName: name,   // the user you clicked on
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`${name} added to group!`);
      console.log("Updated group:", data.group);
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Error adding member:", error);
  }
}

useEffect(()=>{
    if(!socket) return

    const handler=(obj)=>{

        if(obj.roomid===groupid)
        {
            setuserjoined((prev)=> [...prev,obj.name])
        }

    }


    socket.on('informothersaboutuser',handler)

},[socket])

    
  return (
    <div className='chat'>
          <div className="chatheader">
            <div className="usernameandprofile">
              <img src={profile==="" ? images.noprofile : profile} alt='profile'/>
              <p>{name}</p>
              {
                createdBy === logindata.name ?  <button onClick={()=> setshowinvitebox(true)}>invite</button> : ''
              }

              {
                screensize < 480 ? '' : <p>{createdBy}'s Room</p>
              }
             
              
              
            </div>
            
    
          </div>
          <div className="chatbox">
            {
           allchats.map((i,index)=>{

            const dateStr = i.time;
  const date = new Date(dateStr);

  // WhatsApp-like time format (12-hour with AM/PM)
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
            return(<div className={i.sender===logindata.name ? 'sendermsg' : 'receivermsg'} key={index}>
                <div className="msgdp" style={{display: i.sender!==logindata.name ? 'flex':'none'}}>
                  {
                    i.sender!==logindata.name ? <img src={i.senderimg===null ? images.noprofile : i.senderimg}alt='dp'/> : ''
                }
                </div>
                <div className="insidemsg">
                  <p>{i.message} <span style={{color:'grey',fontSize:'12px',fontStyle:'italic',marginLeft:'5px'}}>{time}</span></p>
                 
                </div>
                
              
              </div>)
           })
        }
        {

        }
            {
  showinvitebox ? (
    <div className="invitebox">
      <button onClick={() => setshowinvitebox(false)} style={{ alignSelf: 'flex-start' }}>
        Close
      </button>
      {contacts.map((i, index) =>
        members.includes(i.name) ? null : (
          <div
            className="singleinvitecontact"
            key={index}
            onClick={() =>
              navigate('/chat', {
                state: {
                  name: i.name,
                  profile: i.img,
                  email: i.email,
                },
              })
            }
          >
            <div className="imgandname">
              <img src={i.img === null ? images.noprofile : i.img} alt="profile" />
              <p>{i.name}</p>
            </div>
            <div className="invitebtn">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent parent onClick
                  addtogroup(i.name);
                }}
              >
                +
              </button>
            </div>
          </div>
        )
      )}
    </div>
  ) : null
}
            
           
    
          </div>
          <div className="chatinput">
             <input type='text' placeholder='Send Message' value={message} onChange={(e)=>setmessage(e.target.value)}
               />
             <img src={images.send}onClick={()=> sendMessage()}/>
          </div>
        </div>
  )
}

export default RoomPage
