const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-messages");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const generateId = () => {
  const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
  return id;
};
const saveTolocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  // const todolist = data ? data : todos;
  const todolist = data || todos;
  todosBody.innerHTML = "";
  if (!todolist.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No task found!</td></tr>";
    return;
  }
  todolist.forEach((todo) => {
    todosBody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "No date"}</td>
      <td>${todo.completed ? "Completed" : "Pending"}</td>
      <td>
        <button onclick="editHandler('${todo.id}')">Edit</button>
        <button onclick="toggleHandler('${todo.id}')">
        ${todo.completed ? "Undo" : "Do"}
    </button>
        <button onclick="deleteHandler('${todo.id}')">Delete</button>
      </td>
    </tr>
    `;
  });
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task: task,
    date: date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveTolocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("please enter a todo!", "error");
  }
};
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveTolocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully", "success");
  } else {
    showAlert("No todos to clear", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => {
    return todo.id !== id;
  });

  todos = newTodos;
  saveTolocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
};
const toggleHandler = (id) => {
  // const newTodos = todos.map((todo) => {
  //   if (todo.id === id) {
  //     // return {
  //     //   id: todo.id,
  //     //   task: todo.task,
  //     //   date: todo.date,
  //     //   completed: !todo.completed,
  //     // };
  //     return {
  //       ...todo,
  //       completed: !todo.completed,
  //     };
  //   } else {
  //     return todo;
  //   }
  // });
  // todos = newTodos;
  const todo = todos.find((todo) => {
    return todo.id === id;
  });
  todo.completed = !todo.completed;
  saveTolocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully", "success");
};
const editHandler = (id) => {
  const todo = todos.find((todo) => {
    return todo.id === id;
  });
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => {
    return todo.id === id;
  });
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveTolocalStorage();
  displayTodos();
  showAlert("Todo Edited successfully", "success");
};
const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => {
        return todo.completed === false;
      });
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => {
        return todo.completed === true;
      });
      break;
    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};
window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
