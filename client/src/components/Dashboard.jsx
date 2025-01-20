import { useState } from 'react'
import MainSection from '../components/MainSection/MainSection'
import LeftBar from './LeftBar'
import './Dashboard.css'

const Dashboard = () => {
  const [employeeId, setEmployeeId] = useState('')
  return (
    <div className="dashboard-container">
        <LeftBar employeeId={employeeId} />
        <MainSection setEmployeeId={setEmployeeId} />
    </div>
  )
}


export default Dashboard
