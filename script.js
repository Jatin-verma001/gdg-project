document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`;
            li.innerHTML = `
                <span class="task-text ${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</span>
                <div>
                    <button class="btn btn-sm btn-${task.completed ? 'secondary' : 'success'} me-1 toggle-task-btn" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn btn-sm btn-warning me-1 edit-task-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-task-btn" data-index="${index}">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        } else {
            alert('Task cannot be empty!');
        }
    };

    const toggleTask = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const editTask = (index) => {
        const newTaskText = prompt('Edit your task:', tasks[index].text);
        if (newTaskText !== null && newTaskText.trim() !== '') {
            tasks[index].text = newTaskText.trim();
            saveTasks();
            renderTasks();
        } else {
            alert('Task cannot be empty!');
        }
    };

    const deleteTask = (index) => {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-task-btn')) {
            const index = e.target.dataset.index;
            toggleTask(index);
        } else if (e.target.classList.contains('edit-task-btn')) {
            const index = e.target.dataset.index;
            editTask(index);
        } else if (e.target.classList.contains('delete-task-btn')) {
            const index = e.target.dataset.index;
            deleteTask(index);
        }
    });

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            renderTasks(filter);

            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    renderTasks();
});
