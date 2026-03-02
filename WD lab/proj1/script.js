// Select elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Function to add a task
addBtn.addEventListener('click', () => {
    const taskValue = taskInput.value;

    if (taskValue.trim() !== "") {
        // Create the list item
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskValue}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Add delete functionality to the new button
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
        });

        // Append to the list and clear input
        taskList.appendChild(li);
        taskInput.value = "";
    } else {
        alert("Please enter a task!");
    }
});

// Allow "Enter" key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});