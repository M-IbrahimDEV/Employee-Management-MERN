// import React from 'react'
import NavBar from './pages/NavBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'


// import Dashboard from './pages/Dashboard'
// import Home from './pages/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import WaitingApproval from './pages/Waiting/WaitingApproval';
import UserDashboard from './pages/UserDashboard/UserDashboard'
// import Forgot from './pages/forgotpassword'

const App = () => {
  return (
    <Router>
      <NavBar/>
      <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/userdashboard' element={<UserDashboard/>} />
      <Route path='/waiting-approval' element={<WaitingApproval/>} />
      {/* <Route path='/reset-password' element={<Forgot/>} /> */}
      
      </Routes>
    </Router>
  )
}

export default App