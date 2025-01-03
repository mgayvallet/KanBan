document.getElementById('addTaskBtn').addEventListener('click', () => {
    const taskName = document.getElementById('taskInput').value;
    const taskDesc = document.getElementById('taskDesc').value;
    const columnId = document.getElementById('taskColumn').value;

    if (taskName && taskDesc) {
        const task = document.createElement('div');
        task.className = 'kanban-task';
        task.textContent = taskName;
        task.setAttribute('draggable', 'true');
        
        task.addEventListener('click', () => {
            document.querySelector('.DescriptionTask').style.display = 'flex';  
            document.querySelector('.h2DescriptionTask').textContent = taskName;
            document.querySelector('.descDescriptionTask').textContent = taskDesc;
        });

        attachDragEvents(task);

        document.getElementById(columnId).appendChild(task);
        saveTasks();
        document.getElementById('taskModal').style.display = 'none';
        document.getElementById('taskInput').value = '';
        document.getElementById('taskDesc').value = '';
    } else {
        alert('Veuillez entrer un nom de tâche et une description.');
    }
});

document.querySelector('.retour').addEventListener('click', () => {
    document.querySelector('.DescriptionTask').style.display = 'none';
});

document.querySelector('.reset').addEventListener('click', () => {
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        const tasks = column.querySelectorAll('.kanban-task');
        tasks.forEach(task => {
            task.remove();
        });
    });
    saveTasks();
});

document.querySelector('.addTask').addEventListener('click', () => {
    document.getElementById('taskModal').style.display = 'flex';
});

document.getElementById('closeModalBtn').addEventListener('click', () => {
  document.getElementById('taskModal').style.display = 'none';
});

function attachDragEvents(task) {
  task.addEventListener('dragstart', () => {
    task.classList.add('dragging');
  });

  task.addEventListener('dragend', () => {
    task.classList.remove('dragging');
  });
}

const columns = document.querySelectorAll('.kanban-column');

columns.forEach(column => {
  column.addEventListener('dragover', event => {
    event.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    if (draggingTask) {
      column.appendChild(draggingTask);
    }
  });
});

function saveTasks() {
    const columns = document.querySelectorAll('.kanban-column');
    const tasksData = {};
    columns.forEach(column => {
        const tasks = column.querySelectorAll('.kanban-task');
        tasksData[column.id] = Array.from(tasks).map(task => ({
            name: task.textContent,
            description: task.dataset.description || '',
        }));
    });
    localStorage.setItem('kanbanTasks', JSON.stringify(tasksData));
}

function loadTasks() {
    const tasksData = JSON.parse(localStorage.getItem('kanbanTasks'));
    if (tasksData) {
        const columns = document.querySelectorAll('.kanban-column');
        columns.forEach(column => {
            const columnTasks = tasksData[column.id];
            if (columnTasks) {
                columnTasks.forEach(taskData => {
                    const task = document.createElement('div');
                    task.className = 'kanban-task';
                    task.textContent = taskData.name;
                    task.setAttribute('draggable', 'true');
                    task.dataset.description = taskData.description;
                    attachDragEvents(task);
                    column.appendChild(task);
                });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadTasks);
