import React, { useContext, useEffect, useState } from "react";
import "./AvailableRooms.css";
import { MyContext } from "../Context";
import { useNavigate } from "react-router-dom";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [roomname,setrommname] = useState('')
  const [allrooms,setallrooms] = useState([])

  const navigate = useNavigate()

  const {logindata,socket,contacts} = useContext(MyContext)
  // Fetch all rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://chatapplication-t6e6.onrender.com/allrooms");
        const data = await res.json();
        setallrooms(data)
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchData();
  }, []);

  // Handle creating new room
  async function createroom() {
    

  //if (!roomname) return;

  

  try {
    const res = await fetch("https://chatapplication-t6e6.onrender.com/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupName: roomname,
        createdBy: logindata.name,
        members: [logindata.name], // admin is also a member
        groupImage: null,
        type:'room'
      })
    });

    const data = await res.json();

    if (data.success) {
      setallrooms((prev) => [...prev, data.group]);
      alert("Room Created successfully!");
    } else {
      alert("Error creating room");
    }
  } catch (err) {
    console.error("Failed to create room:", err);
  }
}

  // Filter rooms based on search
  

  return (
    <div className="roomlandingpage">
      <h2>Available Chat Rooms</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search for a room..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* Create new room */}
      <div className="create-room">
        <input
          type="text"
          placeholder="Enter new room name"
          value={roomname}
          onChange={(e) => setrommname(e.target.value)}
        />
        <button onClick={()=>createroom()}>Create Room</button>
      </div>

      {/* Show all rooms */}
      <ul className="room-list">
        {allrooms.length > 0 ? (
          allrooms.map((i, index) => (
            <li key={index} className="room-item" onClick={()=> navigate('/room',{state: {
              groupid: i._id,
              profile: i.groupImage,
              name:i.groupName,
              members:i.members,
              createdBy:i.createdBy
            }})}>
              {i.groupName}
            </li>
          ))
        ) : (
          <p>No rooms found</p>
        )}
      </ul>
    </div>
  );
}

export default AvailableRooms;
