import express from 'express';
import { Employees } from '../models/Employees.js'; // Adjust path if needed

const router = express.Router();

// Helper function to get the first day of the current month
const getCurrentMonthStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 2);
};



const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 2);
};

// Middleware to validate admin
const validateAdmin = async (req, res, next) => {
    const { adminemail } = req.body;
    if (!adminemail) {
        return res.status(400).json({ message: "Admin email is required." });
    }

    try {
        const admin = await Employees.findOne({ email: adminemail });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized. Only admins can perform this action." });
        }
        next();
    } catch (error) {
        console.error("Error validating admin:", error);
        res.status(500).json({ message: "Failed to validate admin." });
    }
};

// Function to create default salary entry for current month
async function createDefaultSalaryEntry(employee) {
    const currentMonthStart = getCurrentMonthStart();
    let currentSalary = employee.allsalary.find(
        (s) => s.date && new Date(s.date).getTime() === currentMonthStart.getTime()
    );

    if (!currentSalary) {
        // Get the last salary details
        const lastSalary = employee.allsalary[employee.allsalary.length - 1] || {};

        // Create a new salary entry for the current month
        currentSalary = {
            amount: lastSalary.amount || 0,
            bonus: 0,
            date: currentMonthStart,
            status: 'notpaid',
        };

        // Add to the array
        employee.allsalary.push(currentSalary);
        await employee.save();
    }
}

// Get salary history
router.post('/history', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Employee email is required." });
    }

    try {
        const employee = await Employees.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Check if salary history is empty
        if (!employee.allsalary || employee.allsalary.length === 0) {
            return res.json([]); // Return an empty array if no salary history
        }

        await createDefaultSalaryEntry(employee);

        res.json(employee.allsalary);
    } catch (error) {
        console.error("Error fetching salary history:", error);
        res.status(500).json({ message: "Failed to fetch salary history." });
    }
});

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Employee email is required." });
    }

    try {
        const employee = await Employees.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        await createDefaultSalaryEntry(employee);

        const currentMonthStart = getCurrentMonthStart();
        const currentSalary = employee.allsalary.find(
            (s) => s.date && new Date(s.date).getTime() === currentMonthStart.getTime()
        );

        res.json(currentSalary);
    } catch (error) {
        console.error("Error fetching salary:", error);
        res.status(500).json({ message: "Failed to fetch salary." });
    }
});


// Update this month's salary and bonus
router.patch('/', validateAdmin, async (req, res) => {
    const { email, amount, bonus } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Employee email is required." });
    }

    try {
        const employee = await Employees.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const currentMonthStart = getCurrentMonthStart();

        let salaryIndex = employee.allsalary.findIndex(
            (s) => s.date && new Date(s.date).getTime() === currentMonthStart.getTime()
        );

        if (salaryIndex === -1) {
            const lastSalary = employee.allsalary[employee.allsalary.length - 1] || {};
            employee.allsalary.push({
                amount: lastSalary.amount || 0,
                bonus: 0,
                date: currentMonthStart,
                status: 'notpaid',
            });
            await employee.save();
            salaryIndex = employee.allsalary.findIndex(
                (s) => s.date && new Date(s.date).getTime() === currentMonthStart.getTime()
            );
            if (salaryIndex === -1){
                return res.status(404).json({ message: "This month's salary entry not found. and we messed up the salary dates" });
            }
        }

        // Update only this month's salary and bonus
        if (amount !== undefined) {
            employee.allsalary[salaryIndex].amount = amount;
        }

        if (bonus !== undefined) {
            employee.allsalary[salaryIndex].bonus = bonus;
        }

        await employee.save();
        res.json({ message: "Salary and bonus updated successfully." });
    } catch (error) {
        console.error("Error updating salary:", error);
        res.status(500).json({ message: "Failed to update salary." });
    }
});

// Get salary history
// router.post('/history', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ message: "Employee email is required." });
//     }

//     try {
//         const employee = await Employees.findOne({ email });

//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found." });
//         }

//         res.json(employee.allsalary);
//     } catch (error) {
//         console.error("Error fetching salary history:", error);
//         res.status(500).json({ message: "Failed to fetch salary history." });
//     }
// });


// Update older month's salary status
router.patch('/status', validateAdmin, async (req, res) => {
    const { email, date, status } = req.body;

    if (!email || !date || !status) {
        return res.status(400).json({ message: "Email, date, and status are required." });
    }

    if (status !== 'paid') {
        return res.status(400).json({ message: "Can only update status to 'paid' for older months." });
    }

    try {
        const employee = await Employees.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const targetMonthStart = getMonthStart(new Date(date));
        const salaryEntry = employee.allsalary.find(
            (s) => s.date && new Date(s.date).getTime() === targetMonthStart.getTime()
        );

        if (!salaryEntry) {
            return res.status(404).json({ message: "Salary entry for the specified month not found." });
        }

        salaryEntry.status = 'paid';

        await employee.save();
        res.json({ message: `Status updated to 'paid' for ${date}.` });
    } catch (error) {
        console.error("Error updating older salary status:", error);
        res.status(500).json({ message: "Failed to update salary status." });
    }
});



export { router as salary };