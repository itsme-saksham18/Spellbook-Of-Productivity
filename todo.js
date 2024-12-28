// FOR THEME SELECTION
const houseSelect = document.getElementById('house-select');
const labels = document.querySelectorAll('label');

function applyHouseTheme() {
    const selectedHouse = houseSelect.value;

    document.body.style.backgroundColor = '#8A2BE2'; // Default color (Purple)
    document.body.style.color = 'white';

    const houseThemes = {
        gryffindor: {
            backgroundColor: '#7F0909', // Gryffindor red
            color: '#FFC500',            // Gryffindor yellow
        },
        hufflepuff: {
            backgroundColor: '#F1C40F', // Hufflepuff yellow
            color: '#3E3B3A',            // Hufflepuff dark grey
        },
        ravenclaw: {
            backgroundColor: '#000A90', // Ravenclaw blue
            color: '#946B2D',            // Ravenclaw bronze
        },
        slytherin: {
            backgroundColor: '#0D6217', // Slytherin green
            color: '#AAAAAA',            // Slytherin silver
        },
        default: {
            backgroundColor: '#8A2BE2', // Default purple
            color: 'white',
        },
    };

    if (houseThemes[selectedHouse]) {
        document.body.style.backgroundColor = houseThemes[selectedHouse].backgroundColor;
        document.body.style.color = houseThemes[selectedHouse].color;

        labels.forEach(label => {
            label.style.color = houseThemes[selectedHouse].color;
        });
    } else {
        document.body.style.backgroundColor = houseThemes.default.backgroundColor;
        document.body.style.color = houseThemes.default.color;

        labels.forEach(label => {
            label.style.color = houseThemes.default.color;
        });
    }
}

houseSelect.addEventListener('change', applyHouseTheme);

// THEME SELECTION END

let tasks = [];

// Reference to form elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date');
const categorySelect = document.getElementById('category-select');
const taskDetails = document.getElementById('task-details');
const taskList = document.getElementById('task-list').querySelector('ul');
const sortSelect = document.getElementById('sort-select');

// Handle task creation
function createTask(event) {
    event.preventDefault();

    const task = {
        description: taskInput.value,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        category: categorySelect.value,
        details: taskDetails.value,
        completed: false, // New task starts as not completed
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskForm.reset();
    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<li>No tasks yet, create one to get started!</li>';
    }

    tasks.forEach((task, index) => {
        const taskItem = document.createElement('li');
        taskItem.classList.toggle('completed', task.completed); // Add 'completed' class if completed
        taskItem.innerHTML = `
            <strong>${task.description}</strong>
            <p>Priority: ${task.priority}</p>
            <p>Due Date: ${task.dueDate}</p>
            <p>Category: ${task.category}</p>
            <p>Details: ${task.details}</p>
            <button onclick="editTask(${index})">Edit Task</button>
            <button onclick="deleteTask(${index})">Delete Task</button>
            <button onclick="toggleCompletion(${index})">${task.completed ? 'Undo Completion' : 'Mark as Completed'}</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Edit task
function editTask(index) {
    const task = tasks[index];
    taskInput.value = task.description;
    prioritySelect.value = task.priority;
    dueDateInput.value = task.dueDate;
    categorySelect.value = task.category;
    taskDetails.value = task.details;

    // Update task on form submit
    taskForm.onsubmit = function (event) {
        event.preventDefault();
        task.description = taskInput.value;
        task.priority = prioritySelect.value;
        task.dueDate = dueDateInput.value;
        task.category = categorySelect.value;
        task.details = taskDetails.value;

        tasks[index] = task; // Update task in array
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Update Local Storage
        displayTasks(); // Re-render task list
        taskForm.reset();
        taskForm.onsubmit = createTask; // Reset to original form submission handler
    };
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1); // Remove task from array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update Local Storage
    displayTasks(); // Re-render task list
}

// Toggle task completion
function toggleCompletion(index) {
    tasks[index].completed = !tasks[index].completed; // Toggle completion status
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Update Local Storage
    displayTasks(); // Re-render task list
}

// Sort tasks by priority or due date
function sortTasks(criteria) {
    if (criteria === 'priority') {
        tasks.sort((a, b) => {
            const priorityOrder = { 'very-urgent': 1, urgent: 2, normal: 3, low: 4, 'very-low': 5 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    } else if (criteria === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    displayTasks(); // Re-render task list after sorting
}

// Initialize page
function init() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    displayTasks();
}

// Event listeners
taskForm.addEventListener('submit', createTask);
window.onload = init;

// Sorting dropdown
sortSelect.addEventListener('change', function () {
    sortTasks(this.value);
});
