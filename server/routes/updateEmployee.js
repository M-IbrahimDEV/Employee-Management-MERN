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

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const email = req.body.email;
        const updateData = { ...req.body };

        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;
        }

        const oldemployee = await Employees.findOne(
            { email:email }
        ) 

        if (!oldemployee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        
        updateData.password = oldemployee.password;

        const employee = await Employees.findOneAndUpdate(
            { email:email },
            updateData
        );


        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }

        
        const updatedemployee = await Employees.findOne(
            { email:email }
        );

        res.json(updatedemployee);

    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee.' });
    }
});


export { router as updateEmployee };


