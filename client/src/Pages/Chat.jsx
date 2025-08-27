import { useLocation } from 'react-router-dom';
import './Chat.css'
import { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from '../Context';
import { images } from '../Assets/Images';

function Chat() {
  const {logindata,socket,showcontacts, setshowcontacts} = useContext(MyContext)
   const location = useLocation();
   const [conersationid,setconversationid] = useState(null)
   const [useronline,setuseronline]  = useState(false)
  const [typing,settyping] = useState(false)
  const { name, profile } = location.state || {};
  const [message,setmessage] = useState('')
  const [allchats,setallchats] = useState([])
  const messagesEndRef = useRef(null);

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
    
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   
  }, [allchats]);


  useEffect(()=>{
    if(!socket) return


    const handler = ( msg)=>{
      if(msg.convid===conersationid)
      {
           setallchats((prev)=> [...prev,msg])
          settyping(true) 
      }

    }
    socket.on('receiver-typing',handler)

  },[socket])


  
  useEffect(() => {
  const fetchChats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/allchats/${conersationid}`);
      const data = await res.json();
      setallchats(data);  // Make sure setallchats is defined in your component
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  };

  if (conersationid) {
    fetchChats();
  }
}, [conersationid]);



function calculatetimediff(x)
{
  var date = Math.abs(x)
  console.log(date)
  var result = ''
  if(date > 3600)
  {
     return 1
  }else{
    return 0
  }

  return result
}



  useEffect(()=>{
    var sendername = logindata.name
    var receivername = name
    var conersationid = []
    
   
    if(sendername < receivername)
    {
        
         conersationid.push(sendername,receivername)
        var id = conersationid.join('-')
        
        setconversationid(id)
    }else{

        conersationid.push(receivername,sendername)
         var id = conersationid.join('-')
         setconversationid(id)
    }
  },[name,logindata])

 
 var receiver = name
  function sendMessage()
  {
   /* var diff = new Date(allchats[allchats.length-1].time) - new Date()
console.log('ms',diff)
const seconds = diff / 1000;
    var res = calculatetimediff(seconds)
    

    if(res===1)
    {
      setallchats((prev)=> [...prev,{convid:conersationid,sender:logindata.name,message:'divider',receiver:receiver}])
    }
*/
    const obj = {convid:conersationid,sender:logindata.name,message:message,receiver:receiver,time:Date()}
    setmessage('')
    setallchats((prev)=> [...prev,obj])
    
    

    socket.emit('sendprivatemsg',obj)

    try {
    fetch('http://localhost:5000/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
  } catch (error) {
    console.error('Error while sending message to backend:', error);
  }

  }




 useEffect(() => {
  const handler = (msg) => {
    if (msg.convid === conersationid) {
      
      setTimeout(()=>{
          settyping(false)
          setallchats((prev) => [...prev, msg]);
      },500)
      
      
    }
  };

  socket.on('receivermsg', handler);

  return () => {
    socket.off('receivermsg', handler);
  };
}, [socket, conersationid]);



  return (
    <div className='chat'>
      <div className="chatheader">
        <div className="usernameandprofile">
          {
                screensize < 480 ? <img src={images.back} alt='back' style={{height:'25px',width:'25px'}} onClick={()=> setshowcontacts(true)}/> : ''
              }
          <img src={profile===null ? images.noprofile : profile} alt='profile'/>
          <p>{name}</p>
          
        </div>

      </div>
      <div className="chatbox">
        {
           allchats.map((i,index)=>{

            const dateStr = i.time;
  const date = new Date(dateStr);

  
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
            return(<div className={i.sender===logindata.name ? 'sendermsg' : 'receivermsg'} key={index}>
                <div className="msgdp" style={{display: i.sender!==logindata.name ? 'flex':'none'}}>
                  
                    <img src={profile}alt='dp'/>
                
                </div>
                <div className="insidemsg">
                  <p>{i.message} <span style={{color:'grey',fontSize:screensize < 480 ? '10px': '12px',fontStyle:'italic',marginLeft:'5px'}}>{time}</span></p>
                 
                </div>
                
              
              </div>)
           })
        }

        {
          typing ? <div className={'receivermsg'}>
                <div className="msgdp" style={{display:'flex'}}>
                  
                    <img src={profile}alt='dp'/>
                


                </div>
                <div className="insidemsg">
                  <p>typing...</p>
                </div>
                
              </div> : ''
        }
        
        <div ref={messagesEndRef} />

      </div>
      <div className="chatinput">
         <input type='text' placeholder='Send Message' onChange={(x)=> {socket.emit('sender-typing',{convid:conersationid,sender:logindata.name,receiver:receiver})
          setmessage(x.target.value)}} value={message}  onKeyUp={(e) => {
    if (e.key === 'Enter') {
      sendMessage()

    }
  }} />
         <button onClick={()=> sendMessage()}>Send</button>
      </div>
    </div>
  )
}

export default Chat
