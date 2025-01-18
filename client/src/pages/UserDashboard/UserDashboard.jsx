import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';




const UserDashboard = () => {








    const calendarData = {
        "2025-01": {
            1: "present",
            2: "absent",
            3: "late",
            4: "leave",
            5: "present",
            6: "present",
            7: "absent",
        },
        "2024-12": {
            28: "leave",
            29: "present",
            30: "late",
            31: "absent",
        },
    };

    // Utility to get a calendar for a given month.
    const getCalendarDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    };

    const renderCalendar = (year, month, data) => {
        const days = getCalendarDays(year, month);
        return (
            <div className="calendar">
                {days.map((day) => (
                    <div
                        key={day}
                        className={`calendar-day ${data[day] || "default"}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based







    const [activeTab, setActiveTab] = useState('settings'); // Tracks the active tab
    const [userData, setUserData] = useState(null); // User info data
    //const [attendance, setAttendance] = useState([]); // Attendance data
    const [salary, setSalary] = useState(null); // Salary data
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        const fetchAndMarkAttendance = async () => {
            try {
                // Fetch user data first
                console.log("user-email:", userEmail);
                const response = await fetch(`http://localhost:8000/employee/email/${userEmail}`);
                console.log("responce");
                console.log(response);
                const data = await response.json();
                console.log("data");
                console.log(data);

                if (!response.ok) {
                    throw new Error('Failed to retrieve user data.');
                }



                // Post attendance data
                const attendanceResponse = await fetch(`http://localhost:8000/employee/attendence/today`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!attendanceResponse.ok) {
                    throw new Error('Failed to mark attendance.');
                }

                // Fetch user data again to ensure it's updated
                setUserData(data);

            } catch (error) {
                console.log("was here ...");
                console.error('Error:', error);
                setError('Failed to fetch user data or mark attendance.');
            }
        };

        fetchAndMarkAttendance();
    }, [userEmail]);

    useEffect(() => {
//         const fetchAttendanceData = async () => {
//             try {
//      //           const response = await fetch(`http://localhost:8000/employee/attendence/${userEmail}`);
//    //             const data = await response.json();
//             //    setAttendance(data || []);
//             } catch (error) {
//                 console.error('Error fetching attendance:', error);
//             }
//         };

        const fetchSalaryData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/employee/salary/${userEmail}`);
                const data = await response.json();
                setSalary(data || null);
            } catch (error) {
                console.error('Error fetching salary:', error);
            }
        };

        // fetchAttendanceData();
        fetchSalaryData();
    }, [userEmail]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <div className="user-dashboard-cont">
            <h1>User Dashboard</h1>
            {error && <p className="error">{error}</p>}

            {userData ? (


                <div className="user-dashboard">

                    <div className="user-details">
                        <div className="user-image">
                            <img src={`http://localhost:8000${userData.image}`} alt="Profile" />
                        </div>
                        <div className="user-data">
                            <p className='user-name'><b>{userData.firstname} {userData.lastname}</b></p>
                            <p><b>Email:</b> {userData.email}</p>
                            <p><b>Phone:</b> {userData.phone}</p>
                            <p><b>Date of Joining:</b> {userData.dateOfJoining || 'Not available'}</p>
                        </div>
                        <button className='edit-button'><img src="./edit.png" title='Edit' /> </button>
                    </div>

                    <div className="tabs">
                        <button onClick={() => setActiveTab('attendance')} className={activeTab === 'attendance' ? 'active' : ''}>Attendance</button>
                        <button onClick={() => setActiveTab('salary')} className={activeTab === 'salary' ? 'active' : ''}>Salary</button>
                        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'attendance' && (
                            // <div className="attendance-tab">
                            //     <h2>Attendance</h2>
                            //     <p><b>Present:</b> {attendance.present || 0}%</p>
                            //     <p><b>Absent:</b> {attendance.absent || 0}%</p>
                            //     <p><b>Leave:</b> {attendance.leave || 0}%</p>
                            //     <p><b>Late:</b> {attendance.late || 0}%</p>
                            //     <table>
                            //         <thead>
                            //             <tr>
                            //                 <th>Date</th>
                            //                 <th>Status</th>
                            //             </tr>
                            //         </thead>
                            //         <tbody>
                            //             {attendance.details?.length > 0 ? (
                            //                 attendance.details.map((day, index) => (
                            //                     <tr key={index}>
                            //                         <td>{new Date(day.date).toLocaleDateString()}</td>
                            //                         <td>{day.status || 'Absent'}</td>
                            //                     </tr>
                            //                 ))
                            //             ) : (
                            //                 <tr>
                            //                     <td colSpan="2">No data available</td>
                            //                 </tr>
                            //             )}
                            //         </tbody>
                            //     </table>
                            // </div>
                            <div className="attendance-container">
                                <h1>Attendance</h1>

                                <div className="stats">
                                    <div className="stat present">
                                        Present: 15 <span>(50%)</span>
                                    </div>
                                    <div className="stat absent">
                                        Absent: 5 <span>(16.67%)</span>
                                    </div>
                                    <div className="stat late">
                                        Late: 3 <span>(10%)</span>
                                    </div>
                                    <div className="stat leave">
                                        Leave: 7 <span>(23.33%)</span>
                                    </div>
                                </div>

                                <h2>Calendar</h2>

                                <div className="calendar-container">
                                    <div className='cal-sub-cont'>
                                    <h3>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</h3>
                                    {renderCalendar(currentYear, currentMonth, calendarData[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`] || {})}
                                    </div>
                                    <div className='cal-sub-cont'>
                                    <h3>{new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentMonth === 0 ? currentYear - 1 : currentYear}</h3>
                                    {renderCalendar(currentYear, currentMonth - 1, calendarData[`${currentYear}-${String(currentMonth).padStart(2, '0')}`] || {})}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'salary' && (
                            <div className="salary-tab">
                                <h2>Salary</h2>
                                <p><b>Regular Salary:</b> {salary?.regular || 0}</p>
                                <p><b>Bonus:</b> {salary?.bonus || 0}</p>
                                <p><b>Fines:</b> {salary?.fines || 0}</p>
                                <p><b>Total Salary:</b> {salary?.total || 0}</p>
                                <h3>Salary History</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salary?.history?.length > 0 ? (
                                            salary.history.map((entry, index) => (
                                                <tr key={index}>
                                                    <td>{entry.month}</td>
                                                    <td>{entry.amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="settings-tab">
                                <h2>Settings</h2>
                                <div className="settings">
                                    <button onClick={() => window.location.href = '/reset-password'}>Reset Password</button>
                                    <button >Edit Information</button>
                                    <button >Request Admin</button>
                                    <button >Request Leave</button>
                                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserDashboard;
