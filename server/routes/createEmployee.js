import express from 'express';
import multer from 'multer';
import path from 'path';
import { Employees } from '../models/Employees.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Destination folder for images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    },
});


const upload = multer({ storage });


router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { firstname, lastname, email, phone, job, dateOfJoining } = req.body;
        const imagePath = req.file ? `/images/${req.file.filename}` : null;

        const employee = new Employees({
            firstname,
            lastname,
            email,
            phone,
            job,
            dateOfJoining,
            image: imagePath, // Save the path of the uploaded image
        });

        await employee.save();
        res.status(201).send(employee);
    } catch (error) {
        console.error("Error saving employee:", error); // Log the error for debugging
        res.status(500).send("EMPLOYEE NOT ADDED");
    }
});

export { router as createEmployee };
