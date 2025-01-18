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
    salary: { 
        type: Number,
        default: 0,
    },
    bonuses: 
    [{ 
        amount: Number,
        date: Date,
        description: String,
    }],
    attendance: 
    [{ 
        date: Date, 
        status: { type: String, 
            enum: ['present', 'absent', 'late', 'leave'] 
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