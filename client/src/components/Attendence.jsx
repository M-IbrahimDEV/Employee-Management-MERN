import React, { useState, useEffect } from 'react';
import './Attendance.css';

const Attendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        // Fetch attendance records from the backend
    }, []);

    const markAttendance = async (status) => {
        // Implement logic to mark today's attendance
    };

    return (
        <div className="attendance">
            <h1>Attendance Records</h1>
            <button onClick={() => markAttendance('present')}>Mark Present</button>
            <button onClick={() => markAttendance('absent')}>Mark Absent</button>
            <button onClick={() => markAttendance('late')}>Mark Late</button>
            <button onClick={() => markAttendance('leave')}>Mark Leave</button>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record, index) => (
                        <tr key={index}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Attendance;