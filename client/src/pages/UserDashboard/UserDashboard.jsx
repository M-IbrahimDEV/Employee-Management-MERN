import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
// import { Chart } from "react-google-charts";
import SalaryComp from '../salarycomp/salarycomp'




const UserDashboard = () => {
    const navigate = useNavigate();


    const [activeTab, setActiveTab] = useState('attendance');
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [attendance, setAttendance] = useState(null);
    // const [currentSalary, setCurrentSalary] = useState({});
    // const [salaryHistory, setSalaryHistory] = useState([]);
    const [error, setError] = useState('');

    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, [])

    useEffect(() => {
        const checkapproved = async () => {
            if (userEmail) {
                try {
                    console.log(userEmail);
                    const response = await fetch(`http://localhost:8000/isapproved/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: userEmail })
                    });
                    const data = await response.json();

                    if (!data.isApproved) {
                        navigate('/waiting-approval');
                    }
                } catch (error) {
                    console.error('Error retrieving user data:', error);
                    setError('Failed to retrieve user data.');
                }
            }
        }
        checkapproved();

    }, [])

    useEffect(() => {
        const fetchAndMarkAttendance = async () => {
            try {
                const attendanceResponse = await fetch(`http://localhost:8000/attendence/today`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!attendanceResponse.ok) {
                    throw new Error('Failed to mark attendance.');
                }


                const response = await fetch(`http://localhost:8000/attendence`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch attendance data.');
                }

                const data = await response.json();
                setAttendance(data);
                console.log(data);

            } catch (error) {
                console.error('Error:', error);
                setError('Failed to mark or get attendance.');
            }
        };

        fetchAndMarkAttendance();
    }, [userEmail]);

    // useEffect(() => {

    //     const fetchSalaryData = async () => {
    //         try {
    //             const currentResponse = await fetch(`http://localhost:8000/salary`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ email: userEmail }),
    //             });
    //             if (!currentResponse.ok) {
    //                 throw new Error('Failed to get salary1.');
    //             }
    //             const currentData = await currentResponse.json();
    //             setCurrentSalary(currentData);


    //             const historyResponse = await fetch(`http://localhost:8000/salary/history`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ email: userEmail }),
    //             });
    //             if (!historyResponse.ok) {
    //                 throw new Error('Failed to get salary2.');
    //             }
    //             const historyData = await historyResponse.json();
    //             setSalaryHistory(historyData);
    //         } catch (error) {
    //             console.error('Error fetching salary:', error);
    //         }
    //     };

    //     fetchSalaryData();
    // }, [userEmail]);

    // const chartData = [
    //     ["Month", "Salary", "Bonus"],
    //     ...salaryHistory.map((item) => [
    //         new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" }),
    //         item.amount,
    //         item.bonus,
    //     ]),
    // ];

    // const chartOptions = {
    //     title: "Salary and Bonus Overview",
    //     hAxis: { title: "Month" },
    //     vAxis: { title: "Amount" },
    //     legend: { position: "bottom" },
    //     colors: ["#4285F4", "#EA4335"],
    // };
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    // };

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/getemployee`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });
                if (!response.ok) {
                    throw new Error('Failed to get USERDAATA.');
                }
                const data = await response.json();

                setUserData(data || null);
            } catch (error) {
                console.error('Error fetching USERDATA:', error);
            }
        };

        fetchUserData();
    }, [userEmail]);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("http://localhost:8000/isadmin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: userEmail }),
                });
                if (!response.ok) {
                    throw new Error('Failed to checkadmin.');
                }

                const data = await response.json();
                if (data.isAdmin) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        checkAdminStatus();
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
                            <p><b>Job:</b> {userData.job || 'Not assigned'}</p>
                            <p><b>Date of Joining:</b> {userData.dateOfJoining || 'Not available'}</p>
                        </div>
                        <button className='edit-button' onClick={() => window.location.href = '/edit-information'}><img src="./edit.png" title='Edit' /> </button>
                    </div>

                    <div className="tabs">
                        <button onClick={() => setActiveTab('attendance')} className={activeTab === 'attendance' ? 'active' : ''}>Attendance</button>
                        <button onClick={() => setActiveTab('salary')} className={activeTab === 'salary' ? 'active' : ''}>Salary</button>
                        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</button>

                    </div>

                    <div className="tab-content">

                        {activeTab === 'attendance' && attendance != null && (

                            <div className="attendance-container">
                                <h2>Attendance</h2>

                                <div className="stats">
                                    <div className="stat present">Present</div>
                                    <div className="stat absent">Absent</div>
                                    <div className="stat late">Late</div>
                                    {/* <div className="stat leave">Leave</div> */}
                                    <div className="stat future">Left-Days</div>
                                    {/* <div className="stat requested">Requested</div> */}
                                </div>




                                <div className='calendar-container'>
                                    <div className='cal-sub-cont'>
                                        <h3>{attendance.month.previous.name} {attendance.year.previous}</h3>
                                        <br />
                                        <hr />
                                        <div className='calendar'>
                                            {attendance.attendance
                                                .filter(entry => entry.date.month === 1)
                                                .map((entry, index) => (
                                                    <div
                                                        className={`${entry.status} calendar-day`}
                                                        key={index}
                                                    >
                                                        {entry.date.day}
                                                    </div>
                                                ))}
                                        </div>
                                        <br />
                                        <hr />
                                        <div className="stats-sub">
                                            <div className="stat present">
                                                {attendance.previousMonth.present}
                                                <span>({attendance.previousMonth.percentages.present}%)</span>
                                            </div>
                                            <div className="stat absent">
                                                {attendance.previousMonth.absent}
                                                <span>({attendance.previousMonth.percentages.absent}%)</span>
                                            </div>
                                            <div className="stat late">
                                                {attendance.previousMonth.late}
                                                <span>({attendance.previousMonth.percentages.late}%)</span>
                                            </div>
                                            {/* <div className="stat leave">
                                                {attendance.previousMonth.leave}
                                                <span>({attendance.previousMonth.percentages.leave}%)</span>
                                            </div> */}
                                            <div className="stat future">
                                                {attendance.previousMonth.future}
                                                <span>({attendance.previousMonth.percentages.future}%)</span>
                                            </div>
                                            {/* <div className="stat requested">
                                                {attendance.previousMonth.requested}
                                                <span>({attendance.previousMonth.percentages.requested}%)</span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className='cal-sub-cont'>
                                        <h3>{attendance.month.current.name} {attendance.year.current}</h3>
                                        <br />
                                        <hr />
                                        <div className='calendar'>
                                            {attendance.attendance
                                                .filter(entry => entry.date.month === 2)
                                                .map((entry, index) => (
                                                    <div
                                                        className={`${entry.status} calendar-day`}
                                                        key={index}
                                                    >
                                                        {entry.date.day}
                                                    </div>
                                                ))}
                                        </div>
                                        <br />
                                        <hr />
                                        <div className="stats-sub">
                                            <div className="stat present">
                                                {attendance.currentMonth.present}
                                                <span>({attendance.currentMonth.percentages.present}%)</span>
                                            </div>
                                            <div className="stat absent">
                                                {attendance.currentMonth.absent}
                                                <span>({attendance.currentMonth.percentages.absent}%)</span>
                                            </div>
                                            <div className="stat late">
                                                {attendance.currentMonth.late}
                                                <span>({attendance.currentMonth.percentages.late}%)</span>
                                            </div>
                                            {/* <div className="stat leave">
                                                {attendance.currentMonth.leave}
                                                <span>({attendance.currentMonth.percentages.leave}%)</span>
                                            </div> */}
                                            <div className="stat future">
                                                {attendance.currentMonth.future}
                                                <span>({attendance.currentMonth.percentages.future}%)</span>
                                            </div>
                                            {/* <div className="stat requested">
                                                {attendance.currentMonth.requested}
                                                <span>({attendance.currentMonth.percentages.requested}%)</span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )}

                        {activeTab === 'salary' && (



                            <SalaryComp email={userEmail} />


                            // <div className="salary-dashboard">
                            //     <h2>Salary Dashboard</h2>

                            //     <div className="current-salary">
                            //         <h2>Current Month&apos;s Salary</h2>
                            //         <p>
                            //             <strong>Amount:</strong> ${currentSalary.amount}
                            //         </p>
                            //         <p>
                            //             <strong>Bonus:</strong>{" "}
                            //             <span className={currentSalary.bonus < 0 ? "negative" : ""}>
                            //                 ${currentSalary.bonus}
                            //             </span>
                            //         </p>
                            //         <p>
                            //             <strong>Status:</strong> {currentSalary.status}
                            //         </p>
                            //         <p>
                            //             <strong>Total:</strong> ${currentSalary.amount + (currentSalary.bonus || 0)}
                            //         </p>
                            //     </div>

                            //     <div className="salary-table">
                            //         <h2>Salary History</h2>
                            //         <table>
                            //             <thead>
                            //                 <tr>
                            //                     <th>Date</th>
                            //                     <th>Amount</th>
                            //                     <th>Bonus</th>
                            //                     <th>Status</th>
                            //                     <th>Total</th>
                            //                 </tr>
                            //             </thead>
                            //             <tbody>
                            //                 {salaryHistory.map((item) => (
                            //                     <tr key={item._id}>
                            //                         <td>{formatDate(item.date)}</td>
                            //                         <td>${item.amount}</td>
                            //                         <td className={item.bonus < 0 ? "negative" : ""}>${item.bonus}</td>
                            //                         <td>{item.status}</td>
                            //                         <td>${item.amount + (item.bonus || 0)}</td>
                            //                     </tr>
                            //                 ))}
                            //             </tbody>
                            //         </table>
                            //     </div>

                            //     <div className="salary-chart">
                            //         <Chart
                            //             chartType="ColumnChart"
                            //             data={chartData}
                            //             options={chartOptions}
                            //             width="100%"
                            //             height="400px"
                            //         />
                            //     </div>
                            // </div>





                        )}



                        {activeTab === 'settings' && (
                            <div className="settings-tab">
                                <h2>Settings</h2>
                                <div className="settings">
                                    <button onClick={() => window.location.href = '/reset-password'}>Reset Password</button>
                                    <button onClick={() => window.location.href = '/edit-information'}>Edit Information</button>
                                    {/* {!isAdmin && (
                                        <button onClick={() => window.location.href = '/leave-req'}>Request Leave</button>
                                    )} */}
                                    {isAdmin && (
                                        <button onClick={() => (window.location.href = "/admin-dashboard")}>Admin Dashboard</button>
                                    )}
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
