import mongoose from "mongoose";

const CoordinatorSchema = new mongoose.Schema({
    // Name (required, string)
    name: {
        type: String,
        required: true,
        trim: true
    },
    
    // Assigned Events (array of strings, defaults to empty array)
    assignedEvents: {
        type: [String],
        default: []
    },
    
    // Department Number (required, string, for lookup/grouping)
    dNo: {
        type: String,
        required: true,
        trim: true
    },
    
    // Password (required, hashed string)
    password: {
        type: String,
        required: true,
        select: false // Ensures password is not returned by default queries
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);
module.exports = Coordinator;