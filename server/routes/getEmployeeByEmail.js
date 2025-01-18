import express from 'express';
import multer from 'multer';
import { Employees } from '../models/Employees.js';

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Path to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});
const upload = multer({ storage });

router.put('/:email', upload.single('image'), async (req, res) => {
    try {
        const email = req.params.email;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;
        }

        const employee = await Employees.findOneAndUpdate(
            { email:email },
            updateData,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee.' });
    }
});
// Route to get an employee by email
router.get('/:email', async (req, res) => {
    console.log("was in email")
    try {
        const email = req.params.email;
        const employee = await Employees.findOne({ email:email });

        console.log(employee);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error getting employee:', error);
        res.status(500).json({ message: 'Failed to get employee.' });
    }
});

export { router as getEmployeeByEmail };


