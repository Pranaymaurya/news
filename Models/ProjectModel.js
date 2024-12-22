import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Open', 'Taken', 'In Progress', 'Completed'], 
    default: 'Open' 
  },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
}, { timestamps: true });
const Project = mongoose.model('Project', projectSchema);

export default Project;
