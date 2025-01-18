// import React from 'react'
// import Image from './Home'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-text">
          <h1 className="home-heading">
            Connecting People, Empowering Teams: Your Ultimate HR Toolkit.
          </h1>
          <p className="home-paragraph">
            Unlock organizational success with our Ultimate HR Toolkit: recruiting excellence, fostering engagement, and building a thriving workplace culture. Connect people, empower teams, and drive results.
          </p>
        </div>
        <div className="home-image-container">
          <img src="/Home.png" alt="Home" className="home-image"/>
        </div>
      </div>
    </div>
  )
}

export default Home
