import express from 'express'
import { Employees } from '../models/Employees.js'
import multer from 'multer';


const router = express.Router();

// Configure multer to save files in 'public/images'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Path to save images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
    },
});
const upload = multer({ storage });


// router.put("/:id", async(req, res) => {
//     try {
//         const employee = await Employees.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         if (!employee) {
//             return res.status(404).send('Employee not found!');
//         }
//         res.send("Employee updated successfully!");
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(`Error updating the employee: ${error.message}`);
//     }
// });

router.put("/:id", upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If a new image is uploaded, include its path in the update
        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;
        }

        const employee = await Employees.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!employee) {
            return res.status(404).send('Employee not found!');
        }

        res.send("Employee updated successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating the employee: ${error.message}`);
    }
});


export { router as updateEmployee };


