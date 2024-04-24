import './style.css';
import { Todos } from "./todos.js";
import { Project, projects } from "./project.js";
import moment from 'moment';
import cautionImageSrc from './asset/caution.png';
import weekImgSrc from './asset/7-days.png';
import todayImgSrc from './asset/date.png'
import plusImgSrc from './asset/add.png';
import binImgSrc from './asset/bin.png';
import searchImgSrc from './asset/search.png';
import addTaskImgSrc from './asset/addtask.png';


function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    return button;
}

function createProjectinputfield() {
    const sideBarDiv = document.querySelector('.sidebar');
    const enterProject = document.createElement('input');
    enterProject.type = 'text';
    enterProject.placeholder = "Enter new project name";
    enterProject.className = 'new-project-inputfield';

    const addButton = createButton('Add', 'submit-project');
    const closeButton = createButton('Close', 'close-button');

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'project-button-container';
    buttonContainer.append(addButton, closeButton);

    sideBarDiv.appendChild(enterProject);
    sideBarDiv.appendChild(buttonContainer);

    return { enterProject, addButton, closeButton };
}


function setupProjectInputEventListeners(enterProject, addButton, closeButton, callback) {
    addButton.addEventListener('click', () => {
        const projectName = enterProject.value.trim();
        if (projectName === "") {
            showAlert("Cannot add an empty project name."); // Check for empty input first
        } else if (projects.some(project => project.name === projectName)) {
            showAlert('Project already exists.', 'error'); // Then check if the project exists
        } else {
            callback(projectName);
            cleanupUI(enterProject, addButton, closeButton);
        }
    });

    closeButton.addEventListener('click', () => cleanupUI(enterProject, addButton, closeButton));

}


function showAlert(message, type) {
    // Check if an alertBox already exists, to show only one alert at a time
    let alertBox = document.querySelector('.alertBox');
    if (!alertBox) {
        // Create the alertBox if it does not exist
        alertBox = document.createElement('div');
        alertBox.className = 'alertBox';

        // Create and configure the image element
        const cautionImg = document.createElement('img');

        cautionImg.src = cautionImageSrc;
        cautionImg.alt = 'Caution';
        cautionImg.style.width = '30px';
        cautionImg.style.height = '30px';
        cautionImg.style.marginRight = '10px';


        const textSpan = document.createElement('span');
        textSpan.textContent = message;

        alertBox.appendChild(cautionImg);
        alertBox.appendChild(textSpan);

        const sidebarDiv = document.querySelector('.sidebar');
        sidebarDiv.appendChild(alertBox);
    } else {
        const textSpan = alertBox.querySelector('span');
        textSpan.textContent = message;
    }

    alertBox.style.color = type === 'error' ? 'red' : 'green';

    setTimeout(() => {
        alertBox.remove();
    }, 1000);
}


function cleanupUI(enterProject, addButton, closeButton) {
    // Hiding elements instead of removing them
    enterProject.style.display = 'none';
    addButton.style.display = 'none';
    closeButton.style.display = 'none';
}


function PromptforProjectName(callback) {
    const sidebarDiv = document.querySelector('.sidebar');
    let enterProject = sidebarDiv.querySelector('.new-project-inputfield');
    let addButton = sidebarDiv.querySelector('.submit-project');
    let closeButton = sidebarDiv.querySelector('.close-button');

    if (!enterProject) {
        const uiElements = createProjectinputfield();
        enterProject = uiElements.enterProject;
        addButton = uiElements.addButton;
        closeButton = uiElements.closeButton;
        setupProjectInputEventListeners(enterProject, addButton, closeButton, callback);
    }

    // Ensure elements are visible when prompting for a new project name
    enterProject.style.display = '';
    addButton.style.display = '';
    closeButton.style.display = '';

    enterProject.value = '';  // Clear previous text
    enterProject.focus();
}


function createProjectElement(projectName) {
    const existingProject = projects.find(project => project.name === projectName);
    if (!existingProject) {
        const newProject = new Project(projectName);
        projects.push(newProject);
        saveToLocalStorage();
    }

    const projectElement = document.createElement('button');
    projectElement.textContent = projectName;
    projectElement.dataset.projectName = projectName;
    projectElement.classList.add('project-button');

    closeProjectButton(projectElement, projectName);
    return projectElement;
}


function closeProjectButton(projectElement, projectName) {
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-project');
    closeButton.innerHTML = '&times;';

    closeButton.addEventListener('click', function (event) {
        event.stopPropagation();
        deleteProjects(projectName);
    });


    projectElement.appendChild(closeButton);
    projectElement.addEventListener('click', function () {
        openProject(projectName);
    });
}


function deleteProjects(projectName) {

    const projectToDelete = projects.find(project => project.name === projectName);
    if (projectToDelete) {
        const taskContainer = document.querySelector('.task-container');
        taskContainer.innerHTML = '';


        const taskElements = document.querySelectorAll(`[data-project="${projectName}"]`);
        taskElements.forEach(taskElement => {
            taskElement.remove();
        });

        const projectTitleToRemove = document.querySelector('.project-name-display');
        if (projectTitleToRemove) {
            projectTitleToRemove.remove();
        }


        delete tasksByProject[projectName];

        const index = projects.indexOf(projectToDelete);
        if (index !== -1) {
            projects.splice(index, 1);
        }
        saveToLocalStorage();
        const projectElement = document.querySelector(`[data-project-name="${projectName}"]`);
        if (projectElement) {
            projectElement.remove();
        }

    } else {
    }

}


function appendProjectToDOM(projectElement) {
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.appendChild(projectElement);
}

function openTaskForm() {
    const taskForm = document.querySelector('.inputField');
    const overlay = document.querySelector('.overlay');

    taskForm.style.display = 'flex';
    overlay.style.display = 'block';
}

function closeTask() {
    const formContainer = document.querySelector('.inputField');
    formContainer.style.display = 'none';
    const overlay = document.querySelector('.overlay')
    overlay.style.display = 'none';

}

document.querySelector('.listCancelBtn').addEventListener('click', closeTask)

const tasksByProject = {};

function showTaskforProject(projectName) {
    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';  // Clear the container first

    const tasks = tasksByProject[projectName];
    if (tasks && tasks.length > 0) {  // Check if tasks is defined and has elements
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskContainer.appendChild(taskElement);
        });
    } else {
        console.log(`No tasks found for project ${projectName}, or project does not exist.`);

    }
}





function addTaskToProject(task, projectName) {
    const project = projects.find(project => project.name === projectName);
    if (project) {
        if (!tasksByProject[projectName]) {
            tasksByProject[projectName] = [];
        }
        tasksByProject[projectName].push(task);
        saveToLocalStorage();
    } else {
        console.log(`Project "${projectName}" not found.`);
    }
}

function createNewTask() {
    if (!window.currentProject || !projects.some(project => project.name === window.currentProject)) {
        alert("Please select a valid project first.");
        return;
    }

    openTaskForm();
    const listSubmitBtn = document.querySelector('.listSubmitBtn');
    listSubmitBtn.addEventListener('click', function () {
        const currentProjectExists = projects.some(project => project.name === window.currentProject);
        if (!currentProjectExists) {
            alert("The project associated with this task has been deleted. Please select a valid project.");
            return;
        }

        const taskTitle = document.getElementById('titleInput').value.trim();
        const taskDescription = document.getElementById('descriptionInput').value.trim();
        const taskDate = document.getElementById('dateInput').value;
        const priority = document.getElementById('priorityList').value;

        if (taskTitle !== '' && taskDate !== '' && priority !== '') {
            const newTask = new Todos(taskTitle, taskDescription, taskDate, priority, window.currentProject);

            addTaskToProject(newTask, window.currentProject);
            const taskElement = createTaskElement(newTask);
            appendTaskToDOM(taskElement);

            console.log(`Task "${taskTitle}" has been successfully added to project "${window.currentProject}".`);

            document.getElementById('titleInput').value = '';
            document.getElementById('descriptionInput').value = '';
            document.getElementById('dateInput').value = '';
            document.getElementById('priorityList').value = '';
            closeTask();
        }
    });
}

function deleteTask(taskTitle, projectName) {
    // Log the state of tasksByProject for the current project before deletion
    console.log(`Before deletion:`, tasksByProject[projectName]);

    // Remove task from tasksByProject
    const tasks = tasksByProject[projectName];
    const taskIndex = tasks.findIndex(task => task.title === taskTitle);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1); // Remove the task from the array
        saveToLocalStorage();
    } else {
        console.log(`Task "${taskTitle}" not found for deletion in project "${projectName}".`);
        return; // If the task wasn't found, log and exit the function
    }

    const taskElements = document.querySelectorAll(`.task-container[data-task-title="${taskTitle}"]`);
    taskElements.forEach(element => element.remove());
    // Log to confirm
    console.log(`Task "${taskTitle}" removed from project "${projectName}".`);
}


function createTaskElement(task) {
    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';
    taskContainer.setAttribute('data-task-title', task.title);

    const todoButton = document.createElement('button');
    todoButton.className = 'taskButton';


    // Wrap the title in its own element for easy access
    const titleSpan = document.createElement('span');
    titleSpan.textContent = `Title: ${task.title}`;
    titleSpan.className = 'task-title'; // Use this class to specifically target the title
    todoButton.appendChild(titleSpan);

    const detailButton = document.createElement('img');
    detailButton.className = 'detailButton';
    detailButton.src = searchImgSrc;

    const displayDate = document.createElement('p');
    displayDate.textContent = `Due Date: ${task.getFormattedDueDate()}`;
    taskContainer.setAttribute('data-task-date', task.date);
    displayDate.className = 'display-date';

    const displayPriority = document.createElement('p');
    displayPriority.textContent = `Priority: ${task.priority}`;
    displayPriority.className = 'display-priority';

    const deleteTaskButton = document.createElement('img');
    deleteTaskButton.className = 'delete-task';
    deleteTaskButton.src = binImgSrc;

    todoButton.appendChild(detailButton);
    taskContainer.appendChild(todoButton);
    todoButton.appendChild(displayDate);
    todoButton.appendChild(displayPriority);
    todoButton.appendChild(deleteTaskButton);
    toggleTaskDescription(taskContainer, task);
    priorityTaskColour(taskContainer, task);

    return taskContainer;
}


document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-task')) {
        event.stopPropagation();
        const taskContainer = event.target.closest('.task-container');
        const taskTitle = taskContainer.getAttribute('data-task-title'); // Extract the title
        const projectName = window.currentProject;
        deleteTask(taskTitle, projectName);
    }
});


function priorityTaskColour(taskContainer, task) {
    const todoButton = taskContainer.querySelector('.taskButton');

    if (task.priority == 'low') {
        todoButton.style.backgroundColor = '#a3fb77'
    } else if (task.priority == 'medium') {
        todoButton.style.backgroundColor = '#F4FF92';

    } else if (task.priority == 'high') {
        todoButton.style.backgroundColor = '#ff8282';
    }


}



function toggleTaskDescription(taskContainer, task) {
    const detailButton = taskContainer.querySelector('.detailButton');

    detailButton.addEventListener('click', () => {
        let modalContainer = taskContainer.querySelector('.modal');

        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.classList.add('modal');

            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');

            const descriptionTitle = document.createElement('h3');
            descriptionTitle.classList.add('description-title');
            descriptionTitle.innerHTML = 'Description';

            const closeButton = document.createElement('span');
            closeButton.classList.add('close');
            closeButton.innerHTML = '&times;';

            const description = document.createElement('div');
            description.textContent = task.description;
            description.className = 'taskDescription';

            modalContent.appendChild(descriptionTitle);
            modalContent.appendChild(closeButton);
            modalContent.appendChild(description);
            modalContainer.appendChild(modalContent);
            taskContainer.appendChild(modalContainer);

            closeButton.addEventListener('click', () => {
                modalContainer.classList.remove('active');
            });

            window.addEventListener('click', (event) => {
                if (event.target == modalContainer) {
                    modalContainer.classList.remove('active');
                }
            });
        }

        modalContainer.classList.add('active');
    });
}




function appendTaskToDOM(taskElement) {
    const taskContainer = document.querySelector('.task-container');
    taskContainer.appendChild(taskElement);
}



function maincontentUI() {
    const mainContentDiv = document.querySelector('.content');

    const taskContainer = document.createElement('div');
    taskContainer.className = "task-container";
    mainContentDiv.appendChild(taskContainer);

    const projectNameDisplay = document.createElement('div')
    projectNameDisplay.className = 'project-name-display'
    mainContentDiv.appendChild(projectNameDisplay);


    if (!document.querySelector('.addTaskButton')) {
        const projectButton = document.createElement('img');
        projectButton.src = addTaskImgSrc
        projectButton.className = 'addTaskButton';
        mainContentDiv.appendChild(projectButton);

        projectButton.addEventListener("click", createNewTask);
    }
}

function openProject(projectName) {
    // Check if the project exists
    const projectExists = projects.some(project => project.name === projectName);
    if (!projectExists) {
        console.log(`Project "${projectName}" does not exist.`);
        return; // Exit the function if the project does not exist
    }

    window.currentProject = projectName;
    console.log(`Switched to project: ${projectName}`);
    showTaskforProject(projectName);

    const projectNameDisplay = document.querySelector('.project-name-display');
    if (projectNameDisplay) {
        projectNameDisplay.textContent = projectName;
    }
    const addTaskButton = document.querySelector('.addTaskButton');
    if (addTaskButton) {
        addTaskButton.style.display = ''; // Set to empty string to revert to default, or use 'block' or 'inline' as appropriate
    }
}

function showTasksDueThisWeek() {
    const allTasks = Object.values(tasksByProject).flat();
    const last7DaysTasks = allTasks.filter(task => {
        const taskDueDate = moment(task.dueDate, 'YYYY-MM-DD');
        const daysDiff = moment().diff(taskDueDate, 'days');
        return daysDiff >= -7 && daysDiff <= 0; // Task due date is within the last 7 days
    });
    // Clear the current task display
    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    const titleDisplay = document.querySelector('.project-name-display')
    titleDisplay.textContent = 'Tasks due this Week'
    // Display each task due within the last 7 days
    last7DaysTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });
    const addTaskButton = document.querySelector('.addTaskButton');
    if (addTaskButton) {
        addTaskButton.style.display = 'none';
    }
}

function showTasksDueToday() {
    const allTasks = Object.values(tasksByProject).flat();
    const today = moment().startOf('day');

    const tasksDueToday = allTasks.filter(task => {
        const taskDueDate = moment(task.dueDate, 'YYYY-MM-DD').startOf('day');
        return today.isSame(taskDueDate);
    });


    const taskContainer = document.querySelector('.task-container');
    taskContainer.innerHTML = '';

    const titleDisplay = document.querySelector('.project-name-display');
    titleDisplay.textContent = 'Tasks due Today';

    tasksDueToday.forEach(task => {
        const taskElement = createTaskElement(task);
        taskContainer.appendChild(taskElement);
    });

    const addTaskButton = document.querySelector('.addTaskButton');
    if (addTaskButton) {
        addTaskButton.style.display = 'none';
    }
}




function sidebarUI() {

    const TodayButton = document.createElement('button');
    TodayButton.className = 'today-button'
    const sideBarDiv = document.querySelector('.sidebar');

    const todayImg = document.createElement('img');
    todayImg.className = 'button-img';
    todayImg.src = todayImgSrc;

    const todaybuttontext = document.createElement('span');
    todaybuttontext.textContent = 'Today';
    todaybuttontext.className = 'button-text-today';

    TodayButton.appendChild(todayImg);
    // Then append the text
    TodayButton.appendChild(todaybuttontext);

    sideBarDiv.appendChild(TodayButton);
    TodayButton.addEventListener('click', showTasksDueToday);


    const thisWeekButton = document.createElement('button');
    thisWeekButton.className = 'week-button';

    const weekImg = document.createElement('img');
    weekImg.className = 'button-img';
    weekImg.src = weekImgSrc;

    const textSpan = document.createElement('span');
    textSpan.textContent = 'This Week';
    textSpan.className = 'button-text';

    // Append the image first
    thisWeekButton.appendChild(weekImg);
    // Then append the text
    thisWeekButton.appendChild(textSpan);

    sideBarDiv.appendChild(thisWeekButton);

    thisWeekButton.addEventListener('click', showTasksDueThisWeek);



    const title = document.createElement('h3');
    title.textContent = "Projects";
    sideBarDiv.appendChild(title);

    const projectButton = document.createElement('button');
    projectButton.className = 'plus-button';

    const plusSign = document.createElement('img');
    plusSign.className = 'plus-sign';
    plusSign.src = plusImgSrc;

    const buttonText = document.createElement('span');
    buttonText.className = 'button-text'
    buttonText.textContent = 'Add Project'

    projectButton.appendChild(plusSign)
    projectButton.appendChild(buttonText)

    const buttonContainer = document.querySelector('.sidebar');
    buttonContainer.appendChild(projectButton);


    const projectContainerDiv = document.createElement('div');
    projectContainerDiv.className = "projects-container"
    sideBarDiv.appendChild(projectContainerDiv);

    let taskButtonAdded = false;
    projectButton.addEventListener("click", function () {

        PromptforProjectName(function (projectName) {
            if (projectName) {
                const newProjectButton = createProjectElement(projectName);
                appendProjectToDOM(newProjectButton);
                openProject(projectName);

                if (!taskButtonAdded) {
                    maincontentUI();
                    taskButtonAdded = true;
                }
            }
        });
    });

}

function loadFromLocalStorage() {
    console.log("Loading data from local storage...");
    const storedProjects = JSON.parse(localStorage.getItem('projects'));
    console.log("Loaded projects:", storedProjects);
    if (storedProjects) {
        projects.length = 0;
        storedProjects.forEach(projData => {
            projects.push(new Project(projData.name));
        });
    }

    const storedTasks = JSON.parse(localStorage.getItem('tasksByProject'));
    console.log("Loaded tasks:", storedTasks);
    if (storedTasks) {
        Object.keys(storedTasks).forEach(projectName => {
            tasksByProject[projectName] = storedTasks[projectName].map(taskData => new Todos(
                taskData.title,
                taskData.description,
                moment(taskData.dueDate, 'YYYY-MM-DD'),
                taskData.priority,
                taskData.projectName
            ));
        });
    }
}


function saveToLocalStorage() {
    const projectData = projects.map(proj => ({ name: proj.name }));
    localStorage.setItem('projects', JSON.stringify(projectData));

    const tasksData = {};
    Object.keys(tasksByProject).forEach(projectName => {
        tasksData[projectName] = tasksByProject[projectName].map(task => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.format('YYYY-MM-DD'), // Assuming dueDate is a moment object
            priority: task.priority,
            projectName: task.projectName
        }));
    });
    localStorage.setItem('tasksByProject', JSON.stringify(tasksData));
}

function refreshUI() {
    const projectsContainer = document.querySelector('.projects-container');
    const taskContainer = document.querySelector('.task-container');

    if (!projectsContainer || !taskContainer) {
        console.error('One or more containers are missing!');
        return; // Exit the function to avoid further errors
    }

    // Clear existing content
    projectsContainer.innerHTML = '';
    taskContainer.innerHTML = '';

    // Redraw projects
    projects.forEach(project => {
        const projectElement = createProjectElement(project.name);
        appendProjectToDOM(projectElement);
    });

    // Optionally, show tasks for the first project or a selected project
    if (projects.length > 0) {
        showTaskforProject(projects[0].name);
    }
}



export { sidebarUI, maincontentUI, loadFromLocalStorage, refreshUI }