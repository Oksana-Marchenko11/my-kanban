const navbarList = document.querySelector(".navbar-nav");
const formCreateProgect = document.querySelector(".form_create_project");
const formMyProgect = document.querySelector(".form_create_project");
const formAddTask = document.querySelector(".form_add_task");
const formCreateColumn = document.querySelector(".form_create_column");
const container = document.querySelector(".row");
const modalTask = document.getElementById("task_descroption_modal");
const buttonCreateProject = document.querySelector(".create_prog");
const kb_input_search = document.querySelector(".kb_input_search");
const cards = document.querySelectorAll(".kb_card");

fetch("http://localhost:3000/api/project")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    lastData = data.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? current
        : latest;
    });
    console.log(lastData);
    renderProject(lastData.name)
    })
  .catch((error) => console.log(error));

//FUNCTIONS DRAG---GROP///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function allowDrop(event) {
  event.preventDefault();
  if (event.target.classList.contains("droppable")) {
    event.target.style.backgroundColor = "";
  }
}
function dragleave(event) {
  event.target.style.backgroundColor = "grey";
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text/plain");
  var draggedElement = document.getElementById(data);
  draggedElement.style.position = "static";
  event.target.appendChild(draggedElement);
  document.querySelectorAll(".droppable").forEach(function (element) {
    element.style.backgroundColor = "";
  });
}

//FUNCTION CREATE COLUMN///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const createColumStart = (columnHeader, headerColor) => {
  const newColumn = document.createElement("div");
  newColumn.classList.add("col", "kb_column");
  const newCard = document.createElement("div");
  newCard.classList.add("droppable", "card", "kb_card");
  newCard.innerHTML = `<div class="card-header ${headerColor}\
     text-white"><h3 class="kb_card_tile">${columnHeader}</h3></div>`;
  container.classList.add("kb_row_container");
  container.appendChild(newColumn);
  newColumn.appendChild(newCard);

  newCard.addEventListener("dragover", allowDrop);
  newCard.addEventListener("dragleave", dragleave);
  newCard.addEventListener("drop", drop);
};

//NEW COLUMN////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const onSubmitCreateColumn = (e) => {
  e.preventDefault();
  const columnName = e.target.elements.column_name.value;
  createColumNew(columnName, "bg-warning");
};
const createColumNew = (columnHeader, headerColor) => {
  const newColumn = document.createElement("div");
  newColumn.classList.add("col", "kb_column");
  const newCard = document.createElement("div");
  newCard.classList.add("droppable", "card", "kb_card");
  newCard.innerHTML = `<div class="card-header ${headerColor}\
     text-white"><h3 class="kb_card_tile">${columnHeader}</h3></div>`;
  container.appendChild(newColumn);
  newColumn.appendChild(newCard);

  newCard.addEventListener("dragover", allowDrop);
  newCard.addEventListener("drop", drop);
};
formCreateColumn.addEventListener("submit", onSubmitCreateColumn);
// SUBMIT CREATE PROGECT/////////////////////////////////////////////////////////////////////////////////////////////////////////
formCreateProgect.addEventListener("submit", onSubmit);
function onSubmit(e) {
  e.preventDefault();
  const progectName = formCreateProgect.elements.project_name.value;
  fetch("http://localhost:3000/Api/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: progectName,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.log(error));

  formCreateProgect.reset();
  buttonCreateProject.style.display = "none";
  renderProject(progectName);
}

function renderProject(projectName) {
  navbarList.insertAdjacentHTML(
    "beforeend",
    `<li class="nav-item, navbar-brand" >${projectName}</li>`
  );
  navbarList.insertAdjacentHTML(
    "beforeend",
    `<li class="nav-item"><button class="btn-primary kb_add_column">Add new coloumn</button></li>`
  );
  navbarList.insertAdjacentHTML(
    "beforeend",
    `<li class="nav-item"><button type="submit" class="btn-primary add_task" data-bs-toggle="modal" data-bs-target="#create_task_modal">Add new task</button></li>`
  );
  button_add_column = document.querySelector(".kb_add_column");
  button_add_task = document.querySelector(".add_task");
  formAddTask.addEventListener("submit", addTask);
  button_add_column.setAttribute("data-bs-toggle", "modal");
  button_add_column.setAttribute("data-bs-target", "#create_column_modal");

  createColumStart("toDo", "bg-warning");
  createColumStart("Doing", "bg-warning");
  createColumStart("Done", "bg-warning");

  // fetch("http://localhost:3000/Api/tasks")
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((response) => {
  //     const resivedTask = response.map((response) => response.name);
  //     return resivedTask;
  //   })
  //   .catch((error) => console.log(error));
}
// FUNCTION ADD TASK//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addTask(e) {
  e.preventDefault();
  const taskName = e.target.elements.task_name.value;
  fetch("http://localhost:3000/Api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: taskName }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
  const task_area = document.getElementById("textaria");
  const taskDescription = task_area.value;
  const task = document.createElement("div");

  const card = document.querySelector(".kb_card");

  task.classList.add("bg-primary", "text-white", "card", "kb_task_card");
  task.textContent = taskName;
  card.append(task);
  task.setAttribute("data-bs-toggle", "modal");
  task.setAttribute("data-bs-target", "#task_description_modal");
  task.setAttribute("draggable", true);
  task.setAttribute("id", "task_id");

  const task_modal_name = document.querySelector(".kb_task_name_modal");
  task_modal_name.textContent = taskName;
  const task_modal_description = document.querySelector(
    ".task_description_modal"
  );
  task_modal_description.textContent = taskDescription;

  function dragstart_handler(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.effectAllowed = "move";
    document.querySelectorAll(".droppable").forEach(function (element) {
      element.style.backgroundColor = "grey";
    });
  }
  task.addEventListener("dragstart", dragstart_handler);
}
//Search///////////////////////////////////////////////////////////////////////////////////////////////////
function tasksFilter(e) {
  e.preventDefault();
  const input = document.querySelector(".kb_input_search");
  let filter = input.value.toUpperCase();
  tasks = document.querySelectorAll(".kb_task_card");

  tasks.forEach(function (task) {
    txtValue = task.textContent || task.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1 || filter.length < 3) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
}
kb_input_search.addEventListener("input", tasksFilter);
