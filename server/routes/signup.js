import express from 'express';
import { Employees } from '../models/Employees.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Save images in the public/images folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});
const upload = multer({ storage });

// Signup route
router.post('/', upload.single('profilePicture'), async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;
        const profilePicture = req.file ? `/images/${req.file.filename}` : null;
        const today = new Date().toISOString().split('T')[0];

        // Create a new employee with default values
        const newEmployee = new Employees({
            firstname,
            lastname,
            email,
            password,
            phone,
            job: 'TBD', // Default job value
            salary: 0, // Default salary
            isApproved: false, // Default approval status
            image: profilePicture, // Profile picture path
            role: 'user', // Default role
            dateOfJoining: today, 
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Signup successful!', employee: newEmployee });
    } catch (error) {
        console.error('Error during signup:', error);
        
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }
        if (error.code === 11000 && error.keyPattern.phone) {
            return res.status(400).json({ message: 'Phone already used. Please use a different Phone.' });
        }

        res.status(500).json({ message: 'Signup failed. Please try again.' });
    }
});

export { router as signup };