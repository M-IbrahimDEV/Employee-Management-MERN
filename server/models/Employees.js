import mongoose, { Schema } from 'mongoose'


const EmployeeSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String, 
        required: true,
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' ,
    },
    allsalary: [{ 
        amount: Number,
        bonus: Number,
        date: Date,
        status: { type: String, 
            enum: ['paid', 'notpaid'] 
        } 
    }],
    attendance: 
    [{ 
        date: Date, 
        status: { type: String, 
            enum: ['present', 'absent', 'late', 'leave', 'requested'] 
        } 
    }],
    isApproved: { 
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    job: {
        type: String,
        required: true,
    },
    dateOfJoining: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, { timestamps: true })


export const Employees = mongoose.model("Employees", EmployeeSchema);