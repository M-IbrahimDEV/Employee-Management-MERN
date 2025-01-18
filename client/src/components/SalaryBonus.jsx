import React, { useState, useEffect } from 'react';
import './SalaryBonus.css';

const SalaryBonus = () => {
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [bonusHistory, setBonusHistory] = useState([]);

    useEffect(() => {
        // Fetch salary and bonus history from the backend
    }, []);

    return (
        <div className="salary-bonus">
            <h1>Salary & Bonus History</h1>
            <div className="salary-history">
                <h2>Salary History</h2 >
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Salary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                <td>${entry.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bonus-history">
                <h2>Bonus History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Bonus</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonusHistory.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                                <td>${entry.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalaryBonus;