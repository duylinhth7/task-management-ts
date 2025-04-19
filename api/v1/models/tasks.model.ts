import mongoose from "mongoose";


const tasksSchema = new mongoose.Schema({
    title: String,
    status: String,
    content: String,
    createdBy: String,
    listUser: [],
    parentId: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, { timestamps: true });
const Tasks = mongoose.model("Tasks", tasksSchema, "tasks");

export default Tasks;