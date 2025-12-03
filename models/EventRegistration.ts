import mongoose from 'mongoose';

// Define the Registration Schema
const RegistrationSchema = new mongoose.Schema({
    // Basic event identification details
    eventName: {
        type: String,
        required: [true, 'Event name is required for registration.'],
        trim: true,
    },
    teamName: {
        type: String,
        required: [true, 'Team name or individual name is required.'],
        trim: true,
    },
    teamId: {
        type: String,
        trim: true,
    },

    // Specific submission details for the competition
    songTitle: {
        type: String,
        default: '', // Optional submission item
        trim: true,
    },
    tune: {
        type: String,
        default: '', // Optional submission item, perhaps a key or style
        trim: true,
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'correction'], // Enforces specific allowed values
        default: 'pending', // Default status upon creation
        required: true,
    },

    // NEW FIELD: Remarks for feedback or internal notes
    remark: {
        type: String,
        default: 'under review',
        trim: true,
    },

    registrationDate: {
        type: Date,
        default: Date.now,
    },
    
    
}, {
    timestamps: false // We use registrationDate instead of timestamps
});

// Create and export the model
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

export default Registration;