import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './db/index.js'
import { getEmployees } from './routes/getEmployees.js'
import { createEmployee } from './routes/createEmployee.js'
import { deleteEmployee } from './routes/deleteEmployee.js'
import { getEmployeeById } from './routes/getEmployeeById.js'
import { getEmployeeByEmail } from './routes/getEmployeeByEmail.js';
import { searchEmployee } from './routes/searchEmployee.js'
import { updateEmployee } from './routes/updateEmployee.js'
import { signup } from './routes/signup.js'
import { login } from './routes/login.js'
import { attendance } from './routes/attendence.js';
import { salary } from './routes/salary.js';


const app = express()
app.use(cors())
app.use(express.json())
app.use('/images', express.static('public/images'));


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB Connection Failed`, err);
})


// middlewares
app.use('/employee/email', getEmployeeByEmail);
app.use('/employee', attendance);
app.use('/employee', salary);
app.use('/employee', getEmployees);
app.use('/employee', getEmployeeById);
app.use('/employee', deleteEmployee);
app.use('/employee', updateEmployee);
app.use('/employee', createEmployee);
app.use('/searchemployee', searchEmployee)
app.use('/signup', signup);
app.use('/login', login);

app.listen