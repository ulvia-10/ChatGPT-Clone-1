import { Link } from 'react-router-dom'
import './homepage.css'

const Homepage = () => {
  return (
    <div className='homepage'>
      <img src="/orbitCuek.png" alt="" className='orbital' />
      <div className='left'>
        <h1>Cuekin AI</h1>
        <h2>AI yang selalu siap nemenin ngobrol kamu</h2>
        <h3>Jangan salah, yang nyuekin cuma namanya - jawabannya tetap ada buat kamu</h3>
        <Link to={'/dashboard'}>Get Started</Link>
      </div>

      <div className='right'>
        <div className='imgContainer'>
          <div className='bgContainer'>
            <div className="bg"></div>
          </div>
          <img src="/botCuek.png" alt="" className='bot' />
        </div>
      </div>
      <div className='terms'>
        <img src="/logo.png" alt="" />
        <div className='links'>
          <Link to='/'>Term of Service</Link>
          <Link to='/'>Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage

