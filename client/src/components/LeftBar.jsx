// import React, { useState, useEffect } from 'react';
// import './LeftBar.css';
// import EditEmployeeModal from './EditEmployeeModal'; // Import the Edit Modal

// const LeftBar = ({ employeeId, setEmployeeId }) => {
//     const [EmpById, setEmpById] = useState({
//         firstname: '',
//         lastname: '',
//         email: '',
//         phone: '',
//         job: '',
//         dateOfJoining: '',
//         image: ''
//     });

//     const [showEditModal, setShowEditModal] = useState(false); // State to toggle the edit modal

//     useEffect(() => {
//         const getEmployeeById = async () => {
//             const res = await fetch(`http://localhost:8000/employee/${employeeId}`);
//             const data = await res.json();
//             setEmpById(data);
//         };
//         if (employeeId) getEmployeeById();
//     }, [employeeId]);

//     const handleDelete = async () => {
//         try {
//             const res = await fetch(`http://localhost:8000/employee/${employeeId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (res.ok) {
//                 alert('Employee deleted successfully');
//                 setEmployeeId(null);  // Clear employee data from the state
//             } else {
//                 alert('Failed to delete employee');
//             }
//         } catch (error) {
//             console.error('Error deleting employee:', error);
//         }
//     };

//     return (
//         <>
//             {employeeId ? (
//                 <div className="leftbar-container">
//                     <nav>
//                         <div className="profile-details">
//                             <h1><b>{EmpById.firstname} {EmpById.lastname}</b></h1>
//                             <img src={EmpById.image} alt="Employee" className="employee-image" />
//                             <p>{EmpById.email}</p>
//                             <p>{EmpById.phone}</p>
//                             <p>{EmpById.job}</p>
//                             <p>{EmpById.dateOfJoining}</p>
//                             <button onClick={() => setShowEditModal(true)} className="edit-button">Edit Employee</button> {/* Edit button */}
//                             <button onClick={handleDelete} className="delete-button">Delete Employee</button>
//                         </div>
//                     </nav>
//                 </div>
//             ) : (
//                 <div className="leftbar-container">Click on an employee to see data</div>
//             )}

//             {/* Edit Modal */}
//             {showEditModal && (
//                 <EditEmployeeModal 
//                     employee={EmpById} 
//                     setShowEditModal={setShowEditModal} 
//                     setEmployeeId={setEmployeeId}
//                 />
//             )}
//         </>
//     );
// }

// export default LeftBar;

import { useState, useEffect } from 'react';
import './LeftBar.css';
import EditEmployeeModal from './EditEmployeeModal'; // Import the Edit Modal
import PropTypes from 'prop-types'; // Added for prop validation (NEW)


const baseURL = 'http://localhost:8000';

const LeftBar = ({ employeeId, setEmployeeId }) => {
    const [EmpById, setEmpById] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        job: '',
        dateOfJoining: '',
        image: '',
    });

    const [showEditModal, setShowEditModal] = useState(false); // State to toggle the edit modal

    useEffect(() => {
        const getEmployeeById = async () => {
            try { // Added error handling for fetching employee data (NEW)
                const res = await fetch(`http://localhost:8000/employee/${employeeId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch employee data');
                }   
                const data = await res.json();
                const image = `${baseURL}${data.image}`
                data.image = image;
    
                setEmpById(data);
            } catch (error) {
                console.error('Error fetching employee by ID:', error);
            }
        };

        if (employeeId) getEmployeeById();
    }, [employeeId]);

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:8000/employee/${employeeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                alert('Employee deleted successfully');
                setEmployeeId(null); // Clear employee data from the state
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };  

    return (
        <>
            {employeeId ? (
                <div className="leftbar-container">
                    <nav>
                        <div className="profile-details">
                            <h1><b>{EmpById.firstname} {EmpById.lastname}</b></h1>
                            <img src={EmpById.image} alt="Employee" className="employee-image" />
                            <p>{EmpById.email}</p>
                            <p>{EmpById.phone}</p>
                            <p>{EmpById.job}</p>
                            <p>{EmpById.dateOfJoining}</p>
                            <button 
                                onClick={() => setShowEditModal(true)} 
                                className="edit-button"
                            >
                                Edit Employee
                            </button> {/* Edit button */}
                            <button 
                                onClick={handleDelete} 
                                className="delete-button"
                            >
                                Delete Employee
                            </button>
                        </div>
                    </nav>
                </div>
            ) : (
                <div className="leftbar-container">Click on an employee to see data</div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <EditEmployeeModal 
                    employee={EmpById} 
                    setShowEditModal={setShowEditModal} 
                    setEmployeeId={setEmployeeId} 
                />
            )}
        </>
    );
};

// Prop validation (NEW)
LeftBar.propTypes = {
    employeeId: PropTypes.string,
    setEmployeeId: PropTypes.func.isRequired,
};

export default LeftBar;
