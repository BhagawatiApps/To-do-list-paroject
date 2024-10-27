document.addEventListener("DOMContentLoaded", loadTasks);

let editingTaskId = null;

function addTask() {
    const taskName = document.getElementById("task-name").value;
    const taskDeadline = document.getElementById("task-deadline").value;
    const taskCategory = document.getElementById("task-category").value;

    if (!taskName || !taskDeadline) {
        alert("Please fill out all fields.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (editingTaskId) {
        // Update the task if in edit mode
        tasks = tasks.map(task =>
            task.id === editingTaskId
                ? { ...task, name: taskName, deadline: taskDeadline, category: taskCategory }
                : task
        );
        editingTaskId = null;
    } else {
        // Add a new task if not in edit mode
        const task = {
            id: Date.now(),
            name: taskName,
            deadline: taskDeadline,
            category: taskCategory
        };
        tasks.push(task);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("task-name").value = "";
    document.getElementById("task-deadline").value = "";

    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task));
}

function createTaskElement(task) {
    const taskList = document.getElementById("task-list");

    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    const taskInfo = document.createElement("div");
    const taskName = document.createElement("h3");
    taskName.textContent = task.name;
    const taskDeadline = document.createElement("p");
    taskDeadline.textContent = `Due: ${task.deadline}`;
    const taskCategory = document.createElement("p");
    taskCategory.textContent = `Category: ${task.category}`;

    taskInfo.appendChild(taskName);
    taskInfo.appendChild(taskDeadline);
    taskInfo.appendChild(taskCategory);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editTask(task);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteTask(task.id);

    taskItem.appendChild(taskInfo);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}

function editTask(task) {
    
    document.getElementById("task-name").value = task.name;
    document.getElementById("task-deadline").value = task.deadline;
    document.getElementById("task-category").value = task.category;

    editingTaskId = task.id;  
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function filterTasks() {
    const filterCategory = document.getElementById("category-filter").value;
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = filterCategory === "All" ? tasks : tasks.filter(task => task.category === filterCategory);
    tasks.forEach(task => createTaskElement(task));
}

function sortTasksByDate() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    tasks.forEach(task => createTaskElement(task));
}
