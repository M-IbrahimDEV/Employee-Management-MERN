import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import SalaryComp from '../salarycomp/salarycomp'



const UserDashboard = () => {
    const navigate = useNavigate();


    const [activeTab, setActiveTab] = useState('approves');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [allemployees, setAllEmployees] = useState([]);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [salary, setSalary] = useState(0);
    const [showJobPopup, setShowJobPopup] = useState(false);
    const [showJobPopupemp, setShowJobPopupemp] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editJob, setEditJob] = useState('');
    const [editRole, setEditRole] = useState('');
    const [bigemploye, setBigEmployee] = useState('');
    const [ showbigpopup , setshowbigpopup] = useState(false);

    const adminEmail = localStorage.getItem('email');

    useEffect(() => {
        if (!adminEmail) {
            navigate('/');
        }
    }, [adminEmail, navigate])

    useEffect(() => {
        const checkapproved = async () => {
            if (adminEmail) {
                try {
                    console.log(adminEmail);
                    const response = await fetch(`http://localhost:8000/isapproved/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: adminEmail })
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

    }, [adminEmail, navigate])

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("http://localhost:8000/isadmin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: adminEmail }),
                });
                if (!response.ok) {
                    throw new Error('Failed to checkadmin.');
                }

                const data = await response.json();
                if (!data.isAdmin) {
                    window.location.href = '/userdashboard';
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        checkAdminStatus();
    }, [adminEmail]);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/getemployee`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: adminEmail }),
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
    }, [adminEmail]);

    const fetchAllEmployees = async () => {
        try {
            const response = await fetch("http://localhost:8000/getemployee/all", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminemail: adminEmail }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            // Filter out the logged-in user's entry
            const filteredEmployees = data.filter(employee => employee.email !== adminEmail);

            setAllEmployees(filteredEmployees);
        } catch (error) {
            console.error("Error fetching All Employees:", error);
            setError("Failed to load All Employees");
        }
    };

    // Call fetchAllEmployees inside useEffect
    useEffect(() => {
        fetchAllEmployees();
    }, [adminEmail, selectedEmployee]);


    const fetchPendingRequests = async () => {
        try {
            const response = await fetch("http://localhost:8000/getemployee/pending", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminemail: adminEmail }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setPendingRequests(data);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            setError("Failed to load pending requests.");
        }
    };



    useEffect(() => {
        fetchPendingRequests();
    }, [adminEmail, selectedEmployee]);

    const handleApprove = async (email, job, salary) => {
        try {
            const response = await fetch("http://localhost:8000/getemployee/approve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminemail: adminEmail, email, job, salary }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setPendingRequests((prev) =>
                    prev.filter((request) => request.email !== email)
                );
            } else {
                alert(data.message || "Failed to approve request.");
            }
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request.");
        }
    };


    const handleReject = async (email) => {
        try {
            const response = await fetch("http://localhost:8000/getemployee/reject", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminemail: adminEmail, email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setPendingRequests((prev) =>
                    prev.filter((request) => request.email !== email)
                );
            } else {
                alert(data.message || "Failed to reject request.");
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Failed to reject request.");
        }
    };

    const handledelete = async (email) => {
        try {
            const response = await fetch("http://localhost:8000/getemployee/remove", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ adminemail: adminEmail, email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setShowJobPopupemp(false);
                fetchAllEmployees();
            } else {
                alert(data.message || "Failed to delete employee.");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to delete employee.");
        }
    };

    const handleEditJobRole = async () => {
        try {
            // Send the updated job and role to the backend
            const response = await fetch("http://localhost:8000/updateemployee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: selectedEmployee, // Employee's email
                    job: editJob, // Updated job
                    role: editRole, // Updated role
                }),
            });

            if (response.ok) {
                // const updatedEmployee = await response.json();
                alert("Employee details updated successfully!");
                // Close the second popup
                setShowEditPopup(false);
                // Refresh the employee list
                fetchAllEmployees();
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to update employee details.");
            }
        } catch (error) {
            console.error("Error updating employee details:", error);
            alert("Failed to update employee details.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const openJobPopup = (email) => {
        setSelectedEmployee(email);
        setShowJobPopup(true);
    };

    const showbig = (email) => {
        setBigEmployee(email);
        setshowbigpopup(true);
    };

    const closeJobPopup = () => {
        setShowJobPopup(false);
    };

    const closeJobPopupemp = () => {
        setShowJobPopupemp(false);
    };

    const showemppopup = (email) => {
        setSelectedEmployee(email);
        setShowJobPopupemp(true);
    }

    return (
        <div className="admin-dashboard-cont">
            <h1>Admin Dashboard</h1>
            {error && <p className="error">{error}</p>}

            {userData ? (


                <div className="admin-dashboard">

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
                        <button onClick={() => setActiveTab('approve')} className={activeTab === 'approve' ? 'active' : ''}>Approve Requests</button>
                        <button onClick={() => setActiveTab('manage')} className={activeTab === 'manage' ? 'active' : ''}>Manage Employees</button>
                        <button onClick={() => setActiveTab('man-salary')} className={activeTab === 'man-salary' ? 'active' : ''}>Manage Salaries</button>
                        {/* <button onClick={() => setActiveTab('man-leave')} className={activeTab === 'man-leave' ? 'active' : ''}>Manage Leave Requests</button> */}
                        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'active' : ''}>Settings</button>

                    </div>

                    <div className="tab-content">












                        {activeTab === 'settings' && (
                            <div className="settings-tab">
                                <h2>Settings</h2>
                                <div className="settings">
                                    <button onClick={() => window.location.href = '/reset-password'}>Reset Password</button>
                                    <button onClick={() => window.location.href = '/edit-information'}>Edit Information</button>
                                    <button onClick={() => (window.location.href = "/userdashboard")}>User Dashboard</button>
                                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        )}


                        {activeTab === 'approve' && (
                            pendingRequests.length === 0 ? (
                                <h2>No pending requests for approval.</h2>
                            ) : (
                                <div className="approve-tab">
                                    <h2>Pending Approval Requests</h2>
                                    <button
                                        className="refresh-button"
                                        onClick={fetchPendingRequests}
                                    >
                                        <img src="/refresh.png" alt="Refresh" />
                                    </button>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingRequests.map((request) => (
                                                <tr key={request.email}>
                                                    <td>
                                                        <img
                                                            src={`http://localhost:8000${request.image}`}
                                                            alt={`Profile of ${request.name}`}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: '1px solid #ddd',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{request.email}</td>
                                                    <td>{request.firstname} {request.lastname}</td>
                                                    <td>
                                                        <button onClick={() => openJobPopup(request.email)}>
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="reject-button"
                                                            onClick={() => handleReject(request.email)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}


                        {activeTab === 'manage' && (
                            allemployees.length === 0 ? (
                                <h2>No Employees.</h2>
                            ) : (
                                <div className="approve-tab">
                                    <h2>All Employees</h2>
                                    <button
                                        className="refresh-button"
                                        onClick={fetchAllEmployees}
                                    >
                                        <img src="/refresh.png" alt="Refresh" />
                                    </button>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Approved</th>
                                                <th>Job</th>
                                                <th>Phone No</th>
                                                <th>Date of Joining</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allemployees.map((request) => (
                                                <tr key={request.email}

                                                    onClick={() => showemppopup(request.email)} >
                                                    <td>
                                                        <img
                                                            src={`http://localhost:8000${request.image}`}
                                                            alt={`Profile of ${request.name}`}
                                                            style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: '1px solid #ddd',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{request.email}</td>
                                                    <td>{request.firstname} {request.lastname}</td>
                                                    <td>{request.role}</td>
                                                    <td>{request.isApproved ? 'Yes' : 'No'}</td>
                                                    <td>{request.job}</td>
                                                    <td>{request.phone}</td>
                                                    <td>{request.dateOfJoining}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}


                        {activeTab === 'man-salary' && (
                            allemployees.length === 0 ? (
                                <h2>No Employees.</h2>
                            ) : (
                                <div className="approve-tab">
                                    <h2>Manage Salaries</h2>
                                    <button
                                        className="refresh-button"
                                        onClick={fetchAllEmployees}
                                    >
                                        <img src="/refresh.png" alt="Refresh" />
                                    </button>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Email</th>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Job</th>
                                                <th>Phone No</th>
                                                <th>Date of Joining</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allemployees.map((request) => (
                                                request.isApproved && (
                                                    <tr key={request.email} onClick={() => showbig(request.email)}>
                                                        <td>
                                                            {request.image && (
                                                                <img
                                                                    src={`http://localhost:8000${request.image}`}
                                                                    alt={`Profile of ${request.name}`}
                                                                    style={{
                                                                        width: '50px',
                                                                        height: '50px',
                                                                        borderRadius: '50%',
                                                                        objectFit: 'cover',
                                                                        border: '1px solid #ddd',
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>{request.email}</td>
                                                        <td>{request.firstname} {request.lastname}</td>
                                                        <td>{request.role}</td>
                                                        <td>{request.job}</td>
                                                        <td>{request.phone}</td>
                                                        <td>{request.dateOfJoining}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}


                        {/* {activeTab === 'man-leave' && (
                            <div className="leaves-tab">
                                <h2>Manage Leave Requests</h2>
                                <div className="settings">
                                    <button onClick={() => window.location.href = '/reset-password'}>Reset Password</button>
                                    <button onClick={() => window.location.href = '/edit-information'}>Edit Information</button>
                                    <button onClick={() => window.location.href = '/leave-req'}>Request Leave</button>
                                    <button onClick={() => (window.location.href = "/userdashboard")}>User Dashboard</button>
                                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        )} */}














                    </div >
                </div >
            ) : (
                <p>Loading...</p>
            )}

















            {
                showJobPopup && (
                    <div className="job-popup" onClick={closeJobPopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-icon" onClick={closeJobPopupemp}>&times;</span>
                            <h2><b>Approve Employee</b></h2>
                            <p><b>Email:</b> {selectedEmployee}</p>
                            <br />

                            <input
                                type="text"
                                required
                                placeholder="Job Title"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                className="popup-input"
                            />

                            <input
                                type="number"
                                required
                                placeholder="Starting Salary "
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                className="popup-input"
                            />


                            <div className="popup-actions">
                                <button
                                    className="popup-button save-button"
                                    onClick={() => {
                                        handleApprove(selectedEmployee, jobTitle, salary);
                                        closeJobPopup();
                                    }}
                                >
                                    Approve
                                </button>
                            </div>


                        </div>
                    </div>
                )
            }


            {
                showJobPopupemp && (
                    <div className="job-popup" onClick={closeJobPopupemp}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-icon" onClick={closeJobPopupemp}>&times;</span>
                            <h2><b>Employee Details</b></h2>
                            <p><b>Email:</b> {selectedEmployee}</p>
                            <br />
                            <button
                                className="popup-button edit-button"
                                onClick={() => {
                                    setShowEditPopup(true);
                                    const selectedEmployeeData = allemployees.find(emp => emp.email === selectedEmployee);
                                    if (selectedEmployeeData) {
                                        setEditJob(selectedEmployeeData.job || '');
                                        setEditRole(selectedEmployeeData.role || '');
                                    }
                                }}
                            >
                                Edit Job and Role
                            </button>
                            <button
                                className="popup-button delete-btn"
                                onClick={() => handledelete(selectedEmployee)}
                            >
                                DELETE EMPLOYEE
                            </button>
                        </div>
                    </div>
                )
            }


            {
                showEditPopup && (
                    <div className="job-popup" onClick={() => setShowEditPopup(false)}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-icon" onClick={() => setShowEditPopup(false)}>&times;</span>
                            <h2><b>Edit Employee Details</b></h2>
                            <p><b>Email:</b> {selectedEmployee}</p>
                            <br />
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={editJob}
                                onChange={(e) => setEditJob(e.target.value)}
                                className="popup-input"
                            />
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value)}
                                className="popup-select"
                            >
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="popup-actions">
                                <button
                                    className="popup-button save-button"
                                    onClick={handleEditJobRole}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                showbigpopup && (
                    <div className="showbig-popup" onClick={() => setshowbigpopup(false)}>
                        <div className="showbig-popup-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-icon" onClick={() => setshowbigpopup(false)}>&times;</span>
                            <SalaryComp email={bigemploye} />

                                                        

                        </div>
                    </div>
                )
            }















        </div >
    );
};

export default UserDashboard;
