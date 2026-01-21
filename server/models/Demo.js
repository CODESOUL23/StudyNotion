const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Expired", "Converted"],
        default: "Active"
    },
    accessCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Index for auto-expiry check
demoSchema.index({ expiryDate: 1 });

module.exports = mongoose.model("Demo", demoSchema);
