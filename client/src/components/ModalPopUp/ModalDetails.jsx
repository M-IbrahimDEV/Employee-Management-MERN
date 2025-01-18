import { useFormik } from 'formik';
// import React from 'react';
import  { useState } from 'react';
import './ModalDetails.css';
import PropTypes from 'prop-types';

const baseURL = 'http://localhost:8000';

const ModalDetails = ({ setShowModal, getAllEmployee }) => {


    const closeModal = () => {
        setShowModal(false);
    };

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

  /*  const createEmployee = async (values) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseURL}/employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (res.ok) {
                setLoading(false);
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            setLoading(false);
        }
    };

    const createEmployee = async (values) => {
        setLoading(true);
        
        // Assuming you have a way to get the file name, e.g., using a timestamp or a unique identifier
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0]; // Get the selected file
    
        if (file) {
            // Create a new FileReader to read the file as a Data URL
            const reader = new FileReader();
            reader.onloadend = async () => {
                // Here you can save the image to the public/images directory
                // Note: This would typically require a backend service to save the file
                // For this example, we will assume that you have a function to handle this
                const imagePath = `images/${file.name}`; // Create the path to the image
                
                // Create the employee object
                const employeeData = {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    phone: values.phone,
                    job: values.job,
                    dateOfJoining: values.dateOfJoining,
                    image: imagePath // Send the image path to the backend
                };
    
                try {
                    const res = await fetch(`${baseURL}/employee`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(employeeData), // Send the employee data as JSON
                    });
                    if (res.ok) {
                        setLoading(false);
                        setShowModal(false);
                    }
                } catch (error) {
                    console.error("Error adding employee:", error);
                    setLoading(false);
                }
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        } else {
            // Handle case where no file is selected
            console.error("No image selected.");
            setLoading(false);
        }
    };*/
    const createEmployee = async (values) => {
        setLoading(true);
    
        const fileInput = document.querySelector('input[type="file"]');
        const file = fileInput.files[0]; // Get the selected file
    
        if (file) {
            // Create a FormData object to send the file and other form data
            const formData = new FormData();
            formData.append('image', file); // Append the file
            formData.append('firstname', values.firstname);
            formData.append('lastname', values.lastname);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('job', values.job);
            formData.append('dateOfJoining', values.dateOfJoining);
    
            try {
                const res = await fetch(`${baseURL}/employee`, {
                    method: 'POST',
                    body: formData, // Send the FormData
                });
                if (res.ok) {
                    setLoading(false);
                    // setShowModal(false);
                    closeModal();
                    getAllEmployee(); 
                } else {
                    console.error("Failed to add employee");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error adding employee:", error);
                setLoading(false);
            }
        } else {
            console.error("No image selected.");
            setLoading(false);
        }
    };
    

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            job: '',
            dateOfJoining: '',
            image: '',  // Path to the image
        },
        onSubmit: (values) => {
            createEmployee(values);
        },
    });

    return (
        <div className="modal-container" >
            <form onSubmit={formik.handleSubmit} className="modal-form">
                <div className="modal-header">
                    <h2>Add New Employee</h2>
                    <span className="close-btn" onClick={() => setShowModal(false)}>×</span>
                </div>
                <div className="modal-body">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                    />
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                    />
                    <label>Job Position</label>
                    <input
                        type="text"
                        name="job"
                        value={formik.values.job}
                        onChange={formik.handleChange}
                    />
                    <label>Date of Joining</label>
                    <input
                        type="text"
                        name="dateOfJoining"
                        value={formik.values.dateOfJoining}
                        onChange={formik.handleChange}
                    />
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && <img src={imagePreview} alt="Image Preview" className="image-preview" />}
                    <button type="submit">{loading ? 'Saving...' : 'Save Details'}</button>
                </div>
            </form>
        </div>
    );
};


// Define prop-types
ModalDetails.propTypes = {
    setShowModal: PropTypes.func.isRequired, 
    getAllEmployee: PropTypes.func.isRequired, 
};

export default ModalDetails;
