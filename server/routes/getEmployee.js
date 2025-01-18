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

export { router as getEmployee };


