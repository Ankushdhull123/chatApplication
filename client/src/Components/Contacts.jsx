import { useNavigate } from 'react-router-dom'
import './Contacts.css'
import { useContext, useEffect, useState } from 'react'
import { images } from '../Assets/Images'
import { MyContext } from '../Context'
import Nav from './Navbar'
import {toast} from 'react-toastify'

function Contacts() {
  const navigate = useNavigate()
  const { contacts, socket, logindata, showcontacts, setshowcontacts,setContacts } = useContext(MyContext)
  const [showaddfriend, setshowaddfriend] = useState(false)
  const [searchtext, setsearchtext] = useState('')
  const [allgroups, setallgroups] = useState([])
  const [addfriendarray, setaddfriendarray] = useState([])
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
       var filtered = contacts.filter((i) => 
  i.name.toLowerCase().includes(searchtext.toLowerCase()))


       setContacts(filtered)

  }, [searchtext]);

  const toggleshowaddfriend = () => {
    if (showaddfriend) {
      setshowaddfriend(false)
    } else {
      setshowaddfriend(true)
    }
  }

  console.log('add friend data', addfriendarray)

  function addfriend(recname, recid) {
    socket.emit('sendfriendrequest', { sender: logindata.name, receiver: recname, id: recid })
  }

  useEffect(() => {

    if (!socket) return

    const handler = (data) => {
      alert(data.sender + ' sent to friend request')

      localStorage.setItem('friendreq', JSON.stringify(data))

    }

    socket.on('friendreqfromsender', handler)

    return () => {
      socket.off('friendreqfromsender', handler)

    }

  }, [socket])

  async function creategroup() {
    const groupname = prompt("Enter Group Name");

    if (!groupname) return;

    try {
      const res = await fetch("https://chatapplication-t6e6.onrender.com/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupName: groupname,
          createdBy: logindata.name,
          members: [logindata.name], // admin is also a member
          groupImage: images.groupimg,
          type: 'group'
        })
      });

      const data = await res.json();

      if (data.success) {
        setallgroups((prev) => [...prev, data.group]);
        alert("Group created successfully!");
      } else {
        alert("Error creating group");
      }
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  }


  console.log(allgroups)
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch(`https://chatapplication-t6e6.onrender.com/groups/${logindata.name}`);
        const data = await res.json();
        if (data.success) {
          setallgroups(data.groups);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, [logindata.name]);

  return (
    <div className={showcontacts  ? 'contacts' : 'hide'}>
      <div className="searchcontactandadd">
        <div className="headingandfilter">
          <h3>Chats</h3>
          <div style={{display:'flex',gap:'15px'}}>
            <img src={images.group} alt='group' onClick={() => creategroup()} />
          <img src={images.addfriend} alt='addfriend' onClick={() => toast('Adding Friends Feature Coming soon')} />
          </div>
          

        </div>
        <div className="inputforcontactsearch">
          <input type='text' placeholder={showaddfriend ? 'Add Friend' : 'Search Contact'} value={searchtext} onChange={(e) => setsearchtext(e.target.value)} />
        </div>

      </div>
      {
        <div className="allgroups">
          {
            allgroups.map((i) => {
              return (
                <div
                  className='singlecontact'
                  onClick={() => {
                    if (screensize < 480) {
                      setshowcontacts(false);
                    }

                    if (i.type === 'group') {
                      navigate('/group', {
                        state: {
                          groupid: i._id,
                          profile: i.groupImage,
                          name: i.groupName,
                          members: i.members,
                          createdBy: i.createdBy
                        }
                      });
                    } else {
                      navigate('/room', {
                        state: {
                          groupid: i._id,
                          profile: i.groupImage,
                          name: i.groupName,
                          members: i.members,
                          createdBy: i.createdBy
                        }
                      });
                    }
                  }}
                >
                  <img src={images.groupimg} alt='profile' />
                  {i.groupName}
                </div>
              )
            })
          }
        </div>
      }
      {
        showaddfriend ? (<div className="allcontacts">
          <p>Add friend</p>
          {
            addfriendarray.map((i) => {
              return (
                <div className='singlecontact'>
                  <img src={i.img === null ? images.noprofile : i.img} alt='profile' />
                  {i.name}

                  <img src={images.addfriend} alt='addfriend' id='addfiendicon' onClick={() => addfriend(i.name, i._id)} />

                </div>
              )
            })
          }
        </div>) : (<div className="allcontacts">
          {
            contacts.map((i, index) => {
              return (<div className='singlecontact' onClick={() => {
                
                    if (screensize < 480) {
                      setshowcontacts(false);
                    }
                
                navigate('/chat', {
                state: {
                  name: i.name,
                  profile: i.img,
                  email: i.email,

                }
              })}
              } key={index}>
                <img src={i.img === null ? images.noprofile : i.img} alt='profile' />
                <p>{i.name}</p>

              </div>)
            })
          }

        </div>)
      }

    </div>
  )
}

export default Contacts
