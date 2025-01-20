import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

router.post('/', async (req, res) => {
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

router.post('/all', async (req, res) => {
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

router.post('/pending', async (req, res) => {
    try {
        const { adminemail } = req.body;
        if (!adminemail) {
            return res.status(400).json({ message: "Admin email is required." });
        }

        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }
        const employees = await Employees.find({isApproved:false});        
        res.json(employees);
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});


const getCurrentMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 2);
};



router.post('/approve', async (req, res) => {
    try {
        const { adminemail, email, job, salary } = req.body;

        if (!adminemail) {
            return res.status(400).json({ message: "Admin email is required." });
        }

        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }

        const employee = await Employees.findOne({ email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        if (employee.isApproved) {
            return res.status(400).json({ message: 'Employee is already approved.' });
        }

        if (!job) {
            return res.status(400).json({ message: 'Job title is required.' });
        }

        if (!salary) {
            return res.status(400).json({ message: 'Salary title is required.' });
        }

        employee.isApproved = true;
        employee.job = job;
        
        const currentMonthStart = getCurrentMonthStart();
        const currentSalary = {
            amount: salary,
            bonus: 0,
            date: currentMonthStart,
            status: 'notpaid',
        };
        employee.allsalary.push(currentSalary);
        await employee.save();

        res.json({ message: 'Employee approved and job assigned.' });
    } catch (error) {
        console.error('Error approving employee:', error);
        res.status(500).json({ message: 'Failed to approve employee.' });
    }
});


router.delete('/reject', async (req, res) => {
    try {
        const { adminemail, email } = req.body;
        if (!adminemail) {
            return res.status(400).json({ message: "Admin email is required." });
        }

        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }
        const employee = await Employees.findOne({ email:email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        
        if(employee.isApproved){
            return res.status(400).json({ message: 'Employee is approved you can still remove employee' });
        }
        await Employees.deleteOne({email:email});
        res.json({message:'Employee deleted'});
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});

router.delete('/remove', async (req, res) => {
    try {
        const { adminemail, email } = req.body;
        if (!adminemail) {
            return res.status(400).json({ message: "Admin email is required." });
        }

        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }
        const employee = await Employees.findOne({ email:email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        
        if(!employee.isApproved){
            return res.status(400).json({ message: 'Employee is not approved you canreject employee' });
        }
        await Employees.deleteOne({email:email});
        res.json({message:'Employee deleted'});
    } catch (error) {
        console.error('Error removing employee:', error);
        res.status(500).json({ message: 'Failed to remove' });
    }
});



export { router as getEmployee };


