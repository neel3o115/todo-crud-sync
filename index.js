const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.txt");

function createTodoSync(title) {
  const todo = {
    id: generateId(),
    title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const todoString = JSON.stringify(todo, null, 2);
  let current = "";
  if (fs.existsSync(dbPath) && fs.readFileSync(dbPath, "utf8").trim().length > 0) {
    current = "\n";
  }
  fs.appendFileSync(dbPath, current + todoString);
  return todo;
}

function getTodosSync() {
  if (!fs.existsSync(dbPath)) return "";
  return fs.readFileSync(dbPath, "utf8");
}

function getTodoSync(id) {
  if (!fs.existsSync(dbPath)) return "";
  const todos = readTodos();
  const todo = todos.find(t => t.id === id);
  return todo ? JSON.stringify(todo, null, 2) : "";
}

function updateTodoSync(id, updates) {
  const todos = readTodos();
  let found = false;
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      found = true;
      return {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return todo;
  });
  if (found) {
    writeTodos(updatedTodos);
  }
}

function deleteTodoSync(id) {
  const todos = readTodos();
  const filtered = todos.filter(t => t.id !== id);
  writeTodos(filtered);
}

// Helpers
function readTodos() {
  if (!fs.existsSync(dbPath)) return [];
  return fs
    .readFileSync(dbPath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function writeTodos(todos) {
  const data = todos.map(t => JSON.stringify(t, null, 2)).join("\n");
  fs.writeFileSync(dbPath, data);
}

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync
};
