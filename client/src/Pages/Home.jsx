import { images } from '../Assets/Images'
import './Home.css'
function Home() {

  
  return (
    <div className='home'>
      
        <img src={images.messenger} alt='logo'/>
        <p>Send private photos and messages to a friend</p>
        <button>Send Message</button>
    
    </div>
  )
}

export default Home
