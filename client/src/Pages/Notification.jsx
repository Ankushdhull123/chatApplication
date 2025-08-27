import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from '../Context'

function Notification() {

    
    const {logindata} = useContext(MyContext)

    const [friendreqarray,setaddfriendreqarray] = useState([])

    useEffect(()=>{

        var x = JSON.parse(localStorage.getItem('friendreq'))
        if(x!==null)
        {
            setaddfriendreqarray((prev)=> [...prev,x])
        }

    },[])

    

    function deletereq(sender)
    {
        var filtered = friendreqarray.filter((i)=> i.sender!==sender)

        if(filtered.length==0)
        {
            localStorage.removeItem('friendreq')
        }else{
            localStorage.setItem('friendreq',JSON.stringify(filtered))
        }

        
    }

    function confirmReq(senderId) {
  const rec = logindata.name;

  fetch("http://localhost:5000/confirm-friend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, rec })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log("Updated Data:", data); // full user objects
        deletereq(senderId);
      }
    })
    .catch(err => console.error(err));
}


    console.log('friendreq',friendreqarray)
  return (
    <div className='chat'>
      {
        friendreqarray.length===0 ? <p>No Notifications yet</p> : (
            friendreqarray.map((i)=>{
                return(<div>
                    <p>{i.sender}</p>
                    <button onClick={() => confirmReq(i.id)}>Confirm</button>
                    <button onClick={()=> deletereq(i.sender)}> Delete</button>
                </div>)
            })
        )
      }
    </div>
  )
}

export default Notification
