import { useContext, useState } from 'react'
import { images } from '../Assets/Images'
import './Dashboard.css'
import { MyContext } from '../Context'
import { useNavigate } from 'react-router-dom'

function DashBoard() {
  const {logindata,setlogindata} = useContext(MyContext)
  const [profilePic, setProfilePic,] = useState(images.noprofile);

  

  const nav = useNavigate()
  function logout()
  {
    localStorage.removeItem('userdata')
    setlogindata({name:null,phone:null,email:null,desc:null,id:null})
    nav('/')
  }

  async function handleProfileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePic", file);

  try {
    const res = await fetch(`https://chatapplication-t6e6.onrender.com/upload-profile/${logindata.name}`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.success) {
     setProfilePic(data.user.img);
  setlogindata(data.user); // update context directly
  localStorage.setItem("userdata", JSON.stringify(data.user));
    }
  } catch (err) {
    console.error("Upload failed:", err);
  }
}
  return (
    <div className='dash'>
      <div className="profileandlogout">
        <div className="userprofile">
          <label htmlFor="fileInput">
            <img src={logindata.img===null? images.noprofile : logindata.img} alt="profile" style={{ cursor: "pointer" }} />
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfileUpload}
          />
        </div>
        <div className="logout">
          <button onClick={()=> logout()}>Log out</button>

        </div>
      </div>
      <div className="aboutuserdetails">
      <div className="email">
         <p>EMAIL: {logindata.email}</p>
      </div>
      <div className="email">
        <p>PHONE: {logindata.phone}</p>
      </div>
      <div className="email">
        <p>DESCRIPTION: {logindata.desc}</p>
      </div>
       
        
        
      </div>
    
    </div>
  )
}

export default DashBoard
