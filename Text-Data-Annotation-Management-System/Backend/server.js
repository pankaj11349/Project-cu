const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// File path for storing task data
const dataFilePath = path.join(__dirname, 'data', 'annotations.json');

// Helper function to read tasks from the file
const readTasksFromFile = () => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data).tasks;
};

// Helper function to write tasks to the file
const writeTasksToFile = (tasks) => {
    const data = JSON.stringify({ tasks }, null, 2);
    fs.writeFileSync(dataFilePath, data, 'utf8');
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
    const { text, status } = req.body;
    const tasks = readTasksFromFile();
    const newTask = {
        id: tasks.length + 1,
        text,
        status
    };
    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.status(201).json(newTask);
});

// Update task status
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;

    const tasks = readTasksFromFile();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.status = status;
        writeTasksToFile(tasks);
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// DELETE task by ID
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const tasks = readTasksFromFile();

    // Find the index of the task to be deleted
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        // Remove the task from the array
        const deletedTask = tasks.splice(taskIndex, 1);

        // Write the updated tasks array to the file
        writeTasksToFile(tasks);

        // Send a response with the deleted task
        res.status(200).json(deletedTask[0]);
    } else {
        res.status(404).send('Task not found');
    }
});

