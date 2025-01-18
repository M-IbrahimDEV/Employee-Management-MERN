import express from 'express';
import { Employees } from '../models/Employees.js';

const router = express.Router();

router.get("/:search", async (req, res) => {
    console.log(req.params.search);
    try {
        const employee = await Employees.find({
            $or: [
                { firstname: { $regex: req.params.search, $options: 'i' } },
                { lastname: { $regex: req.params.search, $options: 'i' } },
                { email: { $regex: req.params.search, $options: 'i' } },
                { job: { $regex: req.params.search, $options: 'i' } }  // Added job to the search
            ]
        });
        if (employee.length === 0) {
            return res.status(404).send("Employee not found!");
        }
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error fetching employees: ${error.message}`);
    }
});

export { router as searchEmployee };
