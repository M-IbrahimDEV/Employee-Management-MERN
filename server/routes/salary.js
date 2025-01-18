
import express from 'express';
import mongoose from 'mongoose';
import { Employees } from '../models/Employees.js'; // Adjust the path as per your file structure

const router = express.Router();  // Use express.Router() instead of express.attendence()


router.get('/salary/:email', async (req, res) => {
    try {
        console.log("salarygetting");
        const email = req.params.email;
        const employee = await Employees.findOne({ email:email });

        console.log(employee);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.json(employee.salary);
        } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});


export { router as salary }; // Ensure you're exporting the router instance

