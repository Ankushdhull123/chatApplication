import { images } from '../Assets/Images'
import './Home.css'
function Home() {

  
  return (
    <div className='home'>
      
        <img src={images.messenger} alt='logo'/>
        <p >Send private photos and messages to a friend</p>
        <button style={{height:'40px',width:'120px',borderRadius:'5px',backgroundColor:'green',border:'none',color:'white'}}>Send Message</button>
    
    </div>
  )
}

export default Home
