import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const email = req.body.email;
        const employee = await Employees.findOne({ email:email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const { adminemail } = req.body;
        if (!adminemail) {
            return res.status(400).json({ message: "Admin email is required." });
        }

        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }
        const employees = await Employees.find();        
        res.json(employees);
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});



export { router as getEmployee };


