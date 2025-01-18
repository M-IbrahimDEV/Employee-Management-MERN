import express from 'express';
import moment from 'moment';
import { Employees } from '../models/Employees.js';

// const moment = require('moment'); 
const router = express.Router();


router.post('/today', async (req, res) => {

    try {

        const { email } = req.body;
        const employee = await Employees.findOne({ email: email });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const today = new Date().toISOString().split('T')[0]; // Get only the date (YYYY-MM-DD)


        // Check if today's attendance already exists
        const existingAttendance = employee.attendance.find(
            (record) => record.date && record.date.toISOString().split('T')[0] === today
        );


        const currentTime = new Date();
        const attendanceStatus = currentTime.getHours() < 9 || (currentTime.getHours() === 9 && currentTime.getMinutes() <= 30)
            ? 'present'
            : 'late';


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


router.get('/', async (req, res) => {

    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const employee = await Employees.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const today = moment();
        const startOfCurrentMonth = today.clone().startOf('month');
        const startOfPreviousMonth = today.clone().subtract(1, 'month').startOf('month');
        const endOfPreviousMonth = today.clone().subtract(1, 'month').endOf('month');

        // Remove attendance older than the previous month, except for future leave or requested
        employee.attendance = employee.attendance.filter(record => {
            const recordDate = moment(record.date);
            if (recordDate.isAfter(today, 'day')) {
                // Retain records for future leave or requested
                return record.status === 'leave' || record.status === 'requested';
            }
            return recordDate.isBetween(startOfPreviousMonth, today, 'day', '[]');
        });

        // Helper to generate attendance for a month
        const generateAttendance = (start, end) => {
            const daysInMonth = {};
            for (let day = moment(start); day.isSameOrBefore(end, 'day'); day.add(1, 'day')) {
                const existingRecord = employee.attendance.find(record => moment(record.date).isSame(day, 'day'));

                if (existingRecord) {
                    if (day.isAfter(today.clone().endOf('month'), 'day')) {
                        continue;
                    } else if (day.isBefore(today, 'day')) {
                        // Past dates: Change "requested" to "absent"
                        if (existingRecord.status === 'requested') {
                            existingRecord.status = 'absent';
                            daysInMonth[day.format('YYYY-MM-DD')] = 'absent';
                        } else {
                            daysInMonth[day.format('YYYY-MM-DD')] = existingRecord.status;
                        }
                    } else {
                        // Present day: Keep existing record
                        daysInMonth[day.format('YYYY-MM-DD')] = existingRecord.status;
                    }
                } else {
                    // Default handling for days without a record
                    daysInMonth[day.format('YYYY-MM-DD')] = day.isAfter(today, 'day') ? 'future' : 'absent';
                }
            }
            return daysInMonth;
        };

        // Generate attendance data
        const previousMonthAttendance = generateAttendance(startOfPreviousMonth, endOfPreviousMonth);
        const currentMonthAttendance = generateAttendance(startOfCurrentMonth, today.clone().endOf('month'));

        // Count statuses
        const countStatuses = (attendance) => {
            const counts = { present: 0, late: 0, absent: 0, leave: 0, future: 0, requested: 0 };
            Object.values(attendance).forEach(status => counts[status]++);
            const totalDays = Object.keys(attendance).length;
            counts.percentages = {
                present: ((counts.present / totalDays) * 100).toFixed(2),
                late: ((counts.late / totalDays) * 100).toFixed(2),
                absent: ((counts.absent / totalDays) * 100).toFixed(2),
                leave: ((counts.leave / totalDays) * 100).toFixed(2),
                future: ((counts.future / totalDays) * 100).toFixed(2),
                requested: ((counts.requested / totalDays) * 100).toFixed(2)
            };
            return counts;
        };

        const previousMonthStats = countStatuses(previousMonthAttendance);
        const currentMonthStats = countStatuses(currentMonthAttendance);

        // Format response
        await employee.save();
        res.json({
            email: employee.email,
            attendance: [
                ...Object.entries(previousMonthAttendance).map(([date, status]) => ({ date, status })),
                ...Object.entries(currentMonthAttendance).map(([date, status]) => ({ date, status }))
            ],
            previousMonth: previousMonthStats,
            currentMonth: currentMonthStats
        });

        // Save updated attendance
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing attendance' });
    }
});




router.post('/request-leave', async (req, res) => {
    try {
        const { email, date } = req.body;
        if (!email || !date) return res.status(400).json({ message: 'Email and date are required' });

        const employee = await Employees.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const requestedDate = moment(date);
        const today = moment();

        if (requestedDate.isSameOrBefore(today, 'day')) {
            return res.status(400).json({ message: 'Requested date must be a future date' });
        }

        const existingRecord = employee.attendance.find(record => moment(record.date).isSame(requestedDate, 'day'));

        if (existingRecord) {
            return res.status(400).json({ message: 'Attendance already exists for the requested date' });
        }

        employee.attendance.push({
            date: requestedDate.toISOString(),
            status: 'requested'
        });

        await employee.save();

        res.status(200).json({ message: 'Leave requested successfully', date: requestedDate.format('YYYY-MM-DD') });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error requesting leave' });
    }
});


router.get('/upcoming-requests', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'Email is required' });

        const employee = await Employees.findOne({ email });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const today = moment();

        // Filter for upcoming requested dates
        const upcomingRequests = employee.attendance
            .filter(record => (record.status === 'requested' || record.status === 'leave') && moment(record.date).isAfter(today, 'day'))
            .map(record => ({
                date: moment(record.date).format('YYYY-MM-DD'),
                status: record.status
            }));

        res.status(200).json({
            email: employee.email,
            requestedDates: upcomingRequests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving requested dates' });
    }
});


router.get('/clear', async (req, res) => {
    const { email } = req.body;
    const employee = await Employees.findOne({ email: email });
    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }
    employee.attendance = [];
    await employee.save();
    res.json({ message: 'Attendance cleared' });

});

export { router as attendance }; // Ensure you're exporting the router instance
