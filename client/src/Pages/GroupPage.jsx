import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MyContext } from '../Context';
import { images } from '../Assets/Images';
import './GroupPage.css'

function GroupPage() {
   const navigate = useNavigate()
    const location = useLocation();
    const [showinvitebox,setshowinvitebox] = useState(false)
    const [message,setmessage] = useState('')
    const {logindata,socket,contacts,showcontacts, setshowcontacts} = useContext(MyContext)
    const { groupid,name, profile,members ,createdBy} = location.state || {};
    console.log('members',members)
    const [allchats,setallchats] = useState([])

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

     useEffect(() => {
  if (!groupid) return; // safety check

  // Fetch messages when group opens
  fetch(`https://chatapplication-t6e6.onrender.com/groupmessages/${groupid}`)
    .then(res => res.json())   // ✅ parse JSON
    .then(data => {
      setallchats(data);       // store in state
    })
    .catch(err => {
      console.error("Error fetching messages:", err);
    });
}, [groupid]);

    async function sendMessage() {
  if (!message.trim()) return;

  const obj = { groupId: groupid, message: message, sender: logindata.name,senderimg:logindata.img,time:Date(),type:'group' };

  // Optimistic UI update
  setallchats((prev) => [...prev, obj]);
  setmessage("");

  socket.emit("sendMessage", obj);

  // Save to DB
  try {
    await fetch("https://chatapplication-t6e6.onrender.com/addgrpmessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
  } catch (err) {
    console.error("Failed to save message:", err);
  }
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

        socket.emit('joinGroup',groupid)

    },[groupid,socket])

    async function addtogroup(name) {
  try {
    const res = await fetch("https://chatapplication-t6e6.onrender.com/addmembertogroup", {
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

    
  return (
    <div className='chat'>
          <div className="chatheader">
            <div className="usernameandprofile">
              {
                screensize < 480 ? <img src={images.back} alt='back' style={{height:'25px',width:'25px'}} onClick={()=> setshowcontacts(true)}/> : ''
              }

              <img src={profile===null ? images.noprofile : profile} alt='profile'/>
              <p>{name}</p>
              {
                createdBy === logindata.name ?  <button onClick={()=> setshowinvitebox(true)}>invite</button> : ''
              }
              {
                screensize < 480 ? '' : <p>{members.length}</p>
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
                    i.sender!==logindata.name ? <img src={i.senderimg===null? images.noprofile : i.senderimg}alt='dp'/> : ''
                }
                </div>
                <div className="insidemsg">

                  <p>{i.message} <span style={{color:'grey',fontSize:'12px',fontStyle:'italic',marginLeft:'5px'}}>{time}</span></p>
                 
                </div>
                
              
              </div>)
           })
        }
            {
  showinvitebox ? (
    <div className="invitebox">
      <img src={images.close} onClick={() => setshowinvitebox(false)} style={{ alignSelf: 'flex-start',height:'20px',width:'20px',margin:'5px 5px' }}  />
        
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
                  e.stopPropagation(); 
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

export default GroupPage
