// import express from 'express';
// import mongoose from 'mongoose';
// import { Employees } from '../models/Employees.js'; // Adjust the path as per your file structure

// const router = express.Router();

// // Mark today's attendance (present or late)
// router.post('/attendance/today', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//     }

//     try {
//         const employee = await Employees.findOne({ email });

//         if (!employee) {
//             return res.status(404).json({ error: 'Employee not found' });
//         }

//         const today = new Date().toISOString().split('T')[0]; // Get only the date (YYYY-MM-DD)
//         const currentTime = new Date();
//         const attendanceStatus = currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() <= 30)
//             ? 'present'
//             : 'late';

//         // Check if today's attendance already exists
//         const existingAttendance = employee.attendance.find(
//             (record) => record.date && record.date.toISOString().split('T')[0] === today
//         );

//         if (existingAttendance) {
//             return res.status(400).json({ error: 'Attendance for today is already marked.' });
//         }

//         // Add today's attendance
//         employee.attendance.push({ date: new Date(), status: attendanceStatus });
//         await employee.save();

//         return res.status(200).json({ message: `Attendance marked as ${attendanceStatus} for today.` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Update attendance manually (admin use)
// router.post('/attendance/update', async (req, res) => {
//     const { email, date, status } = req.body;

//     if (!email || !date || !status) {
//         return res.status(400).json({ error: 'Email, date, and status are required.' });
//     }

//     if (!['present', 'absent', 'late', 'leave'].includes(status)) {
//         return res.status(400).json({ error: 'Invalid attendance status.' });
//     }

//     try {
//         const employee = await Employees.findOne({ email });

//         if (!employee) {
//             return res.status(404).json({ error: 'Employee not found' });
//         }

//         const attendanceDate = new Date(date);

//         // Check if attendance for the date exists
//         const existingAttendance = employee.attendance.find(
//             (record) => record.date && record.date.toISOString().split('T')[0] === attendanceDate.toISOString().split('T')[0]
//         );

//         if (existingAttendance) {
//             // Update existing record
//             existingAttendance.status = status;
//         } else {
//             // Add new record
//             employee.attendance.push({ date: attendanceDate, status });
//         }

//         await employee.save();
//         return res.status(200).json({ message: `Attendance updated for ${date}.` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// export default router;


import express from 'express';
import mongoose from 'mongoose';
import { Employees } from '../models/Employees.js'; // Adjust the path as per your file structure

const router = express.Router();  // Use express.Router() instead of express.attendence()


// Mark today's attendance (present or late)
router.post('/attendence/today', async (req, res) => {
    const { email } = req.body;

    console.log("was here");
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const employee = await Employees.findOne({ email: email });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const today = new Date().toISOString().split('T')[0]; // Get only the date (YYYY-MM-DD)
        const currentTime = new Date();
        const attendanceStatus = currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() <= 30)
            ? 'present'
            : 'late';

        // Check if today's attendance already exists
        const existingAttendance = employee.attendance.find(
            (record) => record.date && record.date.toISOString().split('T')[0] === today
        );

        if (existingAttendance) {
            return res.status(200).json({ message: `Attendance marked as ${employee.attendance[employee.attendance.length - 1].status} for today.` });
        }

        // Add today's attendance
        employee.attendance.push({ date: new Date(), status: attendanceStatus });
        await employee.save();

        return res.status(200).json({ message: `Attendance marked as ${attendanceStatus} for today.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update attendance manually (admin use)
router.post('/attendence/update', async (req, res) => {
    const { email, date, status } = req.body;

    if (!email || !date || !status) {
        return res.status(400).json({ error: 'Email, date, and status are required.' });
    }

    if (!['present', 'absent', 'late', 'leave'].includes(status)) {
        return res.status(400).json({ error: 'Invalid attendance status.' });
    }

    try {
        const employee = await Employees.findOne({ email: email });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const attendanceDate = new Date(date);

        // Check if attendance for the date exists
        const existingAttendance = employee.attendance.find(
            (record) => record.date && record.date.toISOString().split('T')[0] === attendanceDate.toISOString().split('T')[0]
        );

        if (existingAttendance) {
            // Update existing record
            existingAttendance.status = status;
        } else {
            // Add new record
            employee.attendance.push({ date: attendanceDate, status });
        }

        await employee.save();
        return res.status(200).json({ message: `Attendance updated for ${date}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/attendence/:email', async (req, res) => {
    try {
        console.log("attendencegetting");
        const email = req.params.email;
        const employee = await Employees.findOne({ email:email });

        console.log(employee);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.json(employee.attendance);
        } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});

export { router as attendance }; // Ensure you're exporting the router instance
