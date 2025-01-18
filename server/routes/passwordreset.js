import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
    try {


        const { email, oldpassword, newpassword } = req.body;
        
        const user = await Employees.findOne({ email:email });
        if (!user) {
            return res.status(404).json({ message: 'User  not found.' });
        }

        if (user.password !== oldpassword) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        user.password = newpassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });

    } catch (error) {


        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });


    }
});

export { router as passwordreset };