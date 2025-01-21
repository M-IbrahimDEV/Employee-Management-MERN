// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './salarycomp.css';
import { Chart } from "react-google-charts";

const SalaryComp = (email) => {
    const remail = email.email;
    const navigate = useNavigate();

    const [currentSalary, setCurrentSalary] = useState({});
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

    // const [error, setError] = useState('');

    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        if (!userEmail) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch("http://localhost:8000/isadmin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: userEmail }),
                });
                if (!response.ok) {
                    throw new Error('Failed to checkadmin.');
                }

                const data = await response.json();
                if (data.isAdmin) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        checkAdminStatus();
    }, [userEmail]);


    const fetchSalaryData = async () => {
        try {
            const currentResponse = await fetch(`http://localhost:8000/salary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: remail }),
            });
            if (!currentResponse.ok) {
                throw new Error('Failed to get salary1.');
            }
            const currentData = await currentResponse.json();
            setCurrentSalary(currentData);


            const historyResponse = await fetch(`http://localhost:8000/salary/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: remail }),
            });
            if (!historyResponse.ok) {
                throw new Error('Failed to get salary2.');
            }
            const historyData = await historyResponse.json();
            setSalaryHistory(historyData);
        } catch (error) {
            console.error('Error fetching salary:', error);
        }
    };

    useEffect(() => {
        fetchSalaryData();
    }, [remail]);

    const chartData = [
        ["Month", "Salary", "Bonus"],
        ...salaryHistory.map((item) => [
            new Date(item.date).toLocaleString("default", { month: "short", year: "numeric" }),
            item.amount,
            item.bonus,
        ]),
    ];

    const chartOptions = {
        title: "Salary and Bonus Overview",
        hAxis: { title: "Month" },
        vAxis: { title: "Amount" },
        legend: { position: "bottom" },
        colors: ["#4285F4", "#EA4335"],
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    };



    const handleMark = (date) => {
        console.log("working");

        const markpresent = async () => {
            try {
                const currentResponse = await fetch(`http://localhost:8000/salary/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ adminemail: userEmail, email: remail, date: date }),
                });
                if (!currentResponse.ok) {
                    throw new Error('Failed to mark as present');
                }
            } catch (error) {
                console.error('Error fetching salary:', error);
            }
        };
        markpresent();
        fetchSalaryData();
    };


    return (

        <div className="salary-dashboard">
            <h2>Salary Dashboard</h2>

            <div className="current-salary">
                <h2>Current Month&apos;s Salary</h2>
                <p>
                    <strong>Amount:</strong> ${currentSalary.amount}
                </p>
                <p>
                    <strong>Bonus:</strong>{" "}
                    <span className={currentSalary.bonus < 0 ? "negative" : ""}>
                        ${currentSalary.bonus}
                    </span>
                </p>
                <p>
                    <strong>Status:</strong> {currentSalary.status}
                </p>
                <p>
                    <strong>Total:</strong> ${currentSalary.amount + (currentSalary.bonus || 0)}
                </p>
            </div>

            <div className="salary-table">
                <h2>Salary History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Bonus</th>
                            <th>Status</th>
                            <th>Total</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {salaryHistory.map((item) => (
                            <tr key={item._id}>
                                <td>{formatDate(item.date)}</td>
                                <td>${item.amount}</td>
                                <td className={item.bonus < 0 ? "negative" : ""}>${item.bonus}</td>
                                <td>{item.status}</td>
                                <td>${item.amount + (item.bonus || 0)}</td>
                                {isAdmin && item.status === 'notpaid' && (
                                    <td>
                                        <button onClick={() => handleMark(item.date)}>Mark Paid</button>
                                    </td>
                                )}
                                {isAdmin && item.status === 'paid' && (
                                    <td>State Paid</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="salary-chart">
                <Chart
                    chartType="ColumnChart"
                    data={chartData}
                    options={chartOptions}
                    width="100%"
                    height="400px"
                />
            </div>
        </div>
    )


}
export default SalaryComp;