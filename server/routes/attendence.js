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



router.post('/', async (req, res) => {

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
      const generateAttendance = (start, end, monthIndex) => {
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
                          daysInMonth[day.format('YYYY-MM-DD')] = {
                              day: day.format('DD'),
                              month: monthIndex,
                              status: 'absent'
                          };
                      } else {
                          daysInMonth[day.format('YYYY-MM-DD')] = {
                              day: day.format('DD'),
                              month: monthIndex,
                              status: existingRecord.status
                          };
                      }
                  } else {
                      // Present day: Keep existing record
                      daysInMonth[day.format('YYYY-MM-DD')] = {
                          day: day.format('DD'),
                          month: monthIndex,
                          status: existingRecord.status
                      };
                  }
              } else {
                  // Default handling for days without a record
                  daysInMonth[day.format('YYYY-MM-DD')] = {
                      day: day.format('DD'),
                      month: monthIndex,
                      status: day.isAfter(today, 'day') ? 'future' : 'absent'
                  };
              }
          }
          return daysInMonth;
      };

      // Generate attendance data
      const previousMonthAttendance = generateAttendance(startOfPreviousMonth, endOfPreviousMonth, 1);
      const currentMonthAttendance = generateAttendance(startOfCurrentMonth, today.clone().endOf('month'), 2);

      // Count statuses
      const countStatuses = (attendance) => {
          const counts = { present: 0, late: 0, absent: 0, leave: 0, future: 0, requested: 0 };
          Object.values(attendance).forEach(record => counts[record.status]++);
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

      const previousMonthDays = endOfPreviousMonth.date();
      const currentMonthDays = today.clone().endOf('month').date();

      // Format response
      await employee.save();
      res.json({
          email: employee.email,
          attendance: [
              ...Object.entries(previousMonthAttendance).map(([date, record]) => ({
                  date: {
                      day: record.day,
                      month: 1,
                  },
                  status: record.status
              })),
              ...Object.entries(currentMonthAttendance).map(([date, record]) => ({
                  date: {
                      day: record.day,
                      month: 2,
                  },
                  status: record.status
              }))
          ],
          month: {
              previous: {
                  number: startOfPreviousMonth.format('M'),
                  name: startOfPreviousMonth.format('MMMM'),
                  totalDays: previousMonthDays
              },
              current: {
                  number: startOfCurrentMonth.format('M'),
                  name: startOfCurrentMonth.format('MMMM'),
                  totalDays: currentMonthDays
              }
          },
          year: {
              previous: startOfPreviousMonth.format('YYYY'),
              current: startOfCurrentMonth.format('YYYY')
          },
          previousMonth: previousMonthStats,
          currentMonth: currentMonthStats
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing attendance' });
  }
});




router.post('/request-leave', async (req, res) => {
    try {
        const { email, date } = req.body;
        console.log(email, " ", date)
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

// Leave Management Routes

router.get('/leave-requests', async (req, res) => {
    try {
      const { adminemail, email } = req.body;
      if (!adminemail || !email) {
        return res.status(400).json({ message: "Admin email and user email are required." });
      }
  
      const admin = await Employees.findOne({ email: adminemail });
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
      }
  
      const employee = await Employees.findOne({ email });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      const requestedDates = employee.attendance.filter(record => record.status === 'requested');
      const formattedRequests = requestedDates.map(record => ({
        date: record.date.toISOString(),
        status: record.status
      }));
  
      res.json(formattedRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving leave requests' });
    }
  });
  
  router.put('/leave-requests/approve', async (req, res) => {
    try {
      const { adminemail, email, date } = req.body;
      if (!adminemail || !email || !date) {
        return res.status(400).json({ message: "Admin email, user email, and date are required." });
      }
  
      const admin = await Employees.findOne({ email: adminemail });
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
      }
  
      const employee = await Employees.findOne({ email });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      const requestedDate = employee.attendance.find(record => moment(record.date).isSame(date, 'day'));
      if (!requestedDate || requestedDate.status !== 'requested') {
        return res.status(400).json({ message: 'No leave request found on the specified date' });
      }
  
      const today = moment();
      if (moment(date).isBefore(today, 'day')) {
        requestedDate.status = 'leave';
      } else {
        requestedDate.status = 'leave';
      }
  
      await employee.save();
      res.json({ message: 'Leave request approved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error approving leave request' });
    }
  });
  
  router.put('/leave-requests/reject', async (req, res) => {
    try {
      const { adminemail, email, date } = req.body;
      if (!adminemail || !email || !date) {
        return res.status(400).json({ message: "Admin email, user email, and date are required." });
      }
  
      const admin = await Employees.findOne({ email: adminemail });
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
      }
  
      const employee = await Employees.findOne({ email });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
  
      const requestedDate = employee.attendance.find(record => moment(record.date).isSame(date, 'day'));
      if (!requestedDate || requestedDate.status !== 'requested') {
        return res.status(400).json({ message: 'No leave request found on the specified date' });
      }
  
      const today = moment();
      if (moment(date).isBefore(today, 'day')) {
        requestedDate.status = 'absent';
      } else {
        employee.attendance = employee.attendance.filter(record => !moment(record.date).isSame(date, 'day'));
      }
  
      await employee.save();
      res.json({ message: 'Leave request rejected' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error rejecting leave request' });
    }
  });



export { router as attendance }; // Ensure you're exporting the router instance
