// import React from 'react'
import NavBar from './pages/Navbar/NavBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import WaitingApproval from './pages/Waiting/WaitingApproval'
import Home from './pages/Home/Home'
import UserDashboard from './pages/UserDashboard/UserDashboard'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import Edit from './pages/Edit/Edit'
import Reset from './pages/Reset Password/Reset'
import Leavereq from './pages/LeaveReq/leavereq'  

const App = () => {
  return (
    <Router>
      <NavBar/>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/userdashboard' element={<UserDashboard/>} />
      <Route path='/admin-dashboard' element={<AdminDashboard/>} />
      <Route path='/waiting-approval' element={<WaitingApproval/>} />
      <Route path='/edit-information' element={<Edit/>} />
      <Route path='/reset-password' element={<Reset/>} />
      <Route path='/leave-req' element={<Leavereq/>} />
      
      </Routes>
    </Router>
  )
}

export default App