const $ = document;

const addTaskBtn = $.querySelector(".add-task");
const modal = $.querySelector("#modal");
const editModal = $.getElementById("edit-modal");

// Modals Elements
const modalHeaderCancels = $.querySelectorAll(".modal-header__cancel");
const modalCloseBtn = $.querySelectorAll(".modal-close__btn");
const modalTitle = $.getElementById("modal-title");
const modalCaption = $.getElementById("modal-caption");
const modalSubmitBtn = $.querySelector(".modal-submit__btn");
const tasksWrapper = $.querySelector(".tasks-wrapper");

// Edit Modal
const modalTopTitleEdit = $.querySelector("#modal-top__title");
const modalTopDateEdit = $.querySelector("#modal-top__date");
const modalCaptionEdit = $.querySelector("#modal-caption-edit");
const updateTodo = $.getElementById("update-todo");

//Regex Patters
let regexTitle = /^.+$/;
let regexCaption = /^.{3,150}/;
let regexDate = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

// Overlay UI
const overlay = $.querySelector(".overlay");

let todos = [];
let mainTodoIndex = null;

const addTodo = () => {
  let modalTitleValue = modalTitle.value.trim();
  let modalCaptionValue = modalCaption.value.trim();
  if (
    regexTitle.test(modalTitleValue) &&
    regexCaption.test(modalCaption.value)
  ) {
    let newTodoItem = {
      title: modalTitleValue,
      description: modalCaptionValue,
      date: getNowDate(),
    };
    todos.push(newTodoItem);
    setLocalStorage(todos);
    getLocalStorage();
    clearInputsValue();
    closeAddModal();
  } else {
    alert("You didnt fill all blanks correctly!");
  }
};

const todosGenerator = (todos) => {
  tasksWrapper.innerHTML = "";
  todos.forEach((todo, index) => {
    // console.log(todo , index)
    tasksWrapper.insertAdjacentHTML(
      "beforeend",
      `
        <li class="task" id="task${index}">
          <div class="task-top">
            <h4 class="task-top__title">${todo.title}</h4>
            <span class="task-top__date">${todo.date}</span>
          </div>
          <p class="task-caption">${todo.description}</p>
          <div class="task-buttons">
            <a href="#">
              <svg class="trash" onclick="deleteTodo(${index})">
                <use href="#trash"></use>
              </svg>
            </a>
            <a href="#">
              <svg class="edit" onclick="editTodo(${index},'${todo.title}','${todo.description}','${todo.date}')">
                <use href="#edit"></use>
              </svg>
            </a>
          </div>
        </li>`
    );
  });
};

//Delete Todo
const deleteTodo = (index) => {
  let localStorageTodos = JSON.parse(localStorage.getItem("todos"));

  todos = localStorageTodos;

  let mainTodoIndex = todos.findIndex((todo) => {
    return todo.id === index;
  });

  todos.splice(mainTodoIndex, 1);

  setLocalStorage(todos);
  todosGenerator(todos);
};
//Edit Todo
const editTodo = (index, todoTitle, todoDesc, todoDate) => {
  mainTodoIndex = index;
  modalTopTitleEdit.value = todoTitle;
  modalCaptionEdit.value = todoDesc;
  modalTopDateEdit.value = todoDate;
  openEditModal();
};
// Update => Edit New Todo
const updateNewTodo = () => {
  let localStorageTodos = JSON.parse(localStorage.getItem("todos"));
  todos = localStorageTodos;

  if (
    regexTitle.test(modalTopTitleEdit.value) &&
    regexDate.test(modalTopDateEdit.value) &&
    regexCaption.test(modalCaptionEdit.value)
  ) {
    todos[mainTodoIndex].title = modalTopTitleEdit.value;
    todos[mainTodoIndex].date = modalTopDateEdit.value;
    todos[mainTodoIndex].description = modalCaptionEdit.value;

    setLocalStorage(todos);
    todosGenerator(todos);
    closeEditModal();
  } else {
    alert("You didnt fill all blanks correctly!");
  }
};
// Set Local Storage Data
const setLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
// Get Local Storage Data
const getLocalStorage = () => {
  let localStorageTodos = JSON.parse(localStorage.getItem("todos"));
  if (localStorageTodos) {
    todos = localStorageTodos;
  } else {
    todos = [];
  }
  todosGenerator(todos);
};
// Get Now Time
const getNowDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};
// Open Add Modal
const openAddModal = () => {
  overlay.classList.add("overlay--visible");
  modal.classList.add("modal--visible");
};
// Close Add Modal
const closeAddModal = () => {
  overlay.classList.remove("overlay--visible");
  modal.classList.remove("modal--visible");
};
// Open Edit Modal
const openEditModal = () => {
  overlay.classList.add("overlay--visible");
  editModal.classList.add("modal--visible");
};
// Close Edit Modal
const closeEditModal = () => {
  overlay.classList.remove("overlay--visible");
  editModal.classList.remove("modal--visible");
};
// Clear Inputs Value
const clearInputsValue = () => {
  modalTitle.value = "";
  modalCaption.value = "";
};
// Event Listeners For Modals
addTaskBtn.addEventListener("click", openAddModal);
modalHeaderCancels.forEach((modalHeaderCancel) => {
  modalHeaderCancel.addEventListener("click", () => {
    closeAddModal();
    closeEditModal();
    clearInputsValue();
  });
});
modalCloseBtn.forEach((modalCloseBtn) => {
  modalCloseBtn.addEventListener("click", () => {
    closeAddModal();
    closeEditModal();
    clearInputsValue();
  });
});
// Add New Todo Handler
modalSubmitBtn.addEventListener("click", addTodo);
updateTodo.addEventListener("click", updateNewTodo);
window.addEventListener("load", getLocalStorage);
