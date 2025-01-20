import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './db/index.js'

import { signup } from './routes/signup.js'
import { login } from './routes/login.js'
import { checkapproved } from './routes/checkapproved.js'
import { checkadmin } from './routes/checkadmin.js'
import { passwordreset } from './routes/passwordreset.js'
import { getEmployee } from './routes/getEmployee.js';
import { updateEmployee } from './routes/updateEmployee.js';

import { attendance } from './routes/attendence.js';
import { salary } from './routes/salary.js';

dotenv.config()

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`MongoDB Connection Failed`, err);
})


const app = express()

app.use(cors())
app.use(express.json())
app.use('/images', express.static('public/images'));




// routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/isapproved', checkapproved);
app.use('/isadmin', checkadmin);
app.use('/passwordreset', passwordreset);
app.use('/getemployee', getEmployee);
app.use('/updateemployee', updateEmployee);
app.use('/attendence', attendance);
app.use('/salary', salary);



app.listen