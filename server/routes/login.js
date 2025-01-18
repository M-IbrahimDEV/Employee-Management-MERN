import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await Employees.findOne({ email });

        // If user doesn't exist
        if (!user) {
            return res.status(404).json({ message: 'User  not found.' });
        }

        // Check password (not hashed for now)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Check if the user is approved
        if (!user.isApproved) {
            return res.status(200).json({ message: 'Waiting for approval.', isApproved: false, email: email });
        }

        // If approved, return success
        res.status(200).json({ message: 'Login successful.', isApproved: true, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

export { router as login };