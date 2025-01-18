import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

// Route to get an employee by ID
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const employee = await Employees.findById(userId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});

export { router as getEmployeeById };