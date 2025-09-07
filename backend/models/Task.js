const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
   type: String,
   required:true
  },
  description: {
    type: String,
    required: true,
  },
  taskStatus: {
    type:String,
    enum:["pending", "done"],
    required:true,
    default: "pending"
  }
}, {
  timestamps: true
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;