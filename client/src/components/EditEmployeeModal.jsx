// import React, { useState, useEffect } from 'react';
// import './EditEmployeeModal.css';

// const baseURL = 'http://localhost:8000';

// const EditEmployeeModal = ({ employee, setShowEditModal, setEmployeeId }) => {
//     const [formData, setFormData] = useState({
//         firstname: employee.firstname,
//         lastname: employee.lastname,
//         email: employee.email,
//         phone: employee.phone,
//         job: employee.job,
//         dateOfJoining: employee.dateOfJoining,
//         image: employee.image
//     });

//     useEffect(() => {
//         setFormData(employee); // Pre-fill the form with employee details when the modal opens
//     }, [employee]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 image: URL.createObjectURL(file)
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await fetch(`${baseURL}/employee/${employee._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (res.ok) {
//                 alert('Employee updated successfully!');
//                 setShowEditModal(false);
//                 setEmployeeId(employee._id);  // To re-fetch and update the employee data
//             } else {
//                 alert('Failed to update employee');
//             }
//         } catch (error) {
//             console.error('Error updating employee:', error);
//         }
//     };

//     return (
//         <div className="modal-container" onClick={() => setShowEditModal(false)}>
//             <div className="modal-form" onClick={(e) => e.stopPropagation()}>
//                 <div className="modal-header">
//                     <h2>Edit Employee</h2>
//                     <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
//                 </div>
//                 <form  onSubmit={handleSubmit}>

//                     <label>First Name</label>
//                     <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />

//                     <label>Last Name</label>
//                     <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />

//                     <label>Email</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} required />

//                     <label>Phone</label>
//                     <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

//                     <label>Job</label>
//                     <input type="text" name="job" value={formData.job} onChange={handleChange} required />

//                     <label>Date of Joining</label>
//                     <input type="text" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />

//                     <label>Image</label>
//                     <input type="file" name="image" onChange={handleImageChange} />

//                     {formData.image && <img src={formData.image} alt="Preview" className="image-preview" />}

//                     <button className="submit-button-edit" type="submit">Update Employee</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditEmployeeModal;

import { useState, useEffect } from 'react';
import './EditEmployeeModal.css';
import PropTypes from 'prop-types';

const baseURL = 'http://localhost:8000';

const EditEmployeeModal = ({ employee, setShowEditModal, setEmployeeId, getAllEmployee }) => {
    const [formData, setFormData] = useState({
        firstname: employee.firstname || '',
        lastname: employee.lastname || '',
        email: employee.email || '',
        phone: employee.phone || '',
        job: employee.job || '',
        dateOfJoining: employee.dateOfJoining || '',
        image: employee.image || ''
    });

    const [imageFile, setImageFile] = useState(null); // State to hold the image file

    useEffect(() => {
        setFormData(employee); // Pre-fill the form with employee details when the modal opens
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Store the file in state
            setFormData((prevData) => ({
                ...prevData,
                image: URL.createObjectURL(file) // Preview the image
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('firstname', formData.firstname);
        formDataToSend.append('lastname', formData.lastname);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('job', formData.job);
        formDataToSend.append('dateOfJoining', formData.dateOfJoining);
        if (imageFile) {
            formDataToSend.append('image', imageFile); // Append the image file
        }

        try {
            const res = await fetch(`${baseURL}/employee/${employee._id}`, {
                method: 'PUT',
                body: formDataToSend, // Send FormData instead of JSON
            });

            if (res.ok) {
                alert('Employee updated successfully!');
                getAllEmployee(); // Refetch the employee list
                setEmployeeId(employee._id);  // To re-fetch and update the employee data
                setShowEditModal(false);
            } else {
                alert('Failed to update employee');
            }
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    return (
        <div className="modal-container" onClick={() => setShowEditModal(false)}>
            <div className="modal-form" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Employee</h2>
                    <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input 
                        type="text" 
                        name="firstname" 
                        value={formData.firstname} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Last Name</label>
                    <input 
                        type="text" 
                        name="lastname" 
                        value={formData.lastname} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Phone</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Job</label>
                    <input 
                        type="text" 
                        name="job" 
                        value={ formData.job} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Date of Joining</label>
                    <input 
                        type="text" 
                        name="dateOfJoining" 
                        value={formData.dateOfJoining} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Image</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    {formData.image && <img src={formData.image} alt="Preview" className="image-preview" />}

                    <button className='submit-button-edit' type="submit">Update Employee</button>
                </form>
            </div>
        </div>
    );
};

EditEmployeeModal.propTypes = {
    employee: PropTypes.object.isRequired,
    setShowEditModal: PropTypes.func.isRequired,
    setEmployeeId: PropTypes.func.isRequired,
    getAllEmployee: PropTypes.func.isRequired,
};

export default EditEmployeeModal;
