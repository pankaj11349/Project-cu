document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Clear the list
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task-item');
                taskElement.innerHTML = `
                    <p><strong>Task Text:</strong> ${task.text}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                    <button onclick="updateTaskStatus(${task.id})">Mark as Completed</button>
                `;
                taskList.appendChild(taskElement);
            });
        });
}

function createTask() {
    const taskText = document.getElementById('task-text').value;
    if (taskText) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: taskText, status: 'Pending' })
        })
        .then(response => response.json())
        .then(() => {
            loadTasks(); // Reload tasks after creating a new one
            document.getElementById('task-text').value = ''; // Clear input field
        });
    }
}

function updateTaskStatus(taskId) {
    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' })
    })
    .then(response => response.json())
    .then(() => {
        loadTasks(); // Reload tasks after status update
    });
}
