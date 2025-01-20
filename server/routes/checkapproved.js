import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

// check route
router.post('/', async (req, res) => {
    try {


        const { email } = req.body;
        console.log(req.body);
        
        const user = await Employees.findOne({ email:email });
        if (!user) {
            return res.status(404).json({ message: 'User  not found.' });
        }

        if (user.isApproved) {
            return res.status(200).json({ message: 'User is Approved', isApproved: true });
        }
        else{
            return res.status(200).json({ message: 'Waiting for approval.', isApproved: false});
        }

    } catch (error) {


        console.error('Error during checking approved:', error);
        res.status(500).json({ message: 'Internal Server Error.' });


    }
});

export { router as checkapproved };