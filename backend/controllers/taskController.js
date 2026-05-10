const Task = require('../models/taskModel');
const User = require('../models/userModel');

exports.createTask = async (req, res) => {  
    try {
        const user = req.user.id; // Assuming user ID is available in req.user
        const { title, description, status  , priority} = req.body;
        const newTask = new Task({ title, description, status, priority, user });
        await newTask.save().then(() => {
            res.status(201).json({ message: 'Task created successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating task'});
    }
}



exports.getTasks = async (req, res) => {

    try {

        const userId = req.user.id;
        const role = req.user.role;

        let tasks;
        let user = null;

        // ADMIN
        if (role === "admin") {

            tasks = await Task.find()
                .populate("user", "name email role");

        } 
        
        // NORMAL USER
        else {

            tasks = await Task.find({
                user: userId,
            });

            user = await User.findById(userId)
                .select("name email role");
        }

        
        res.status(200).json({
            success: true,
            role,
            user,
            tasks,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching tasks",
        });

    }
};

exports.deleteTask = async (req, res) => {  
    try {
        const userId = req.user.id; 
        const role = req.user.role;
        const taskId = req.params.id;
        let taskToDelete;
        
        
        // Find the task to ensure it exists and belongs to the user
        if (role === 'admin') {
            // Admin can delete any task
            taskToDelete = await Task.findById(taskId);
            
            
        } else {
            // Regular users can only delete their own tasks
            taskToDelete = await Task.findOne({ _id: taskId, user: userId });
        }

        if (!taskToDelete) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        
        await Task.deleteOne({ _id: taskId });

        res.status(200).json({ message: 'Task deleted successfully' });
       
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task'  + error.message });
    }
};
exports.updateTask = async (req, res) => {
    try {

        const taskId = req.params.id;
        const { title, description, status, priority } = req.body;
        
        // Find the task to ensure it exists and belongs to the user
        const taskToUpdate = await Task.findOne({ _id: taskId});
        
        if (!taskToUpdate) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        
        // Update the task fields
        taskToUpdate.title = title || taskToUpdate.title;
        taskToUpdate.description = description || taskToUpdate.description;
        taskToUpdate.status = status || taskToUpdate.status;
        taskToUpdate.priority = priority || taskToUpdate.priority;
        await taskToUpdate.save();
        res.status(200).json({ message: 'Task updated successfully' });
        
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json({ error: 'Error updating task' });
    }   
};
