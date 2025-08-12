const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.txt');

function createTodoSync(title) {
  const todo = {
    id: Date.now(),
    title,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const todoString = JSON.stringify(todo, null, 2);
  fs.appendFileSync(dbPath, (fs.existsSync(dbPath) && fs.readFileSync(dbPath, 'utf-8').trim().length > 0 ? '\n' : '') + todoString);
  return todo;
}

function getTodosSync() {
  if (!fs.existsSync(dbPath)) return '';
  return fs.readFileSync(dbPath, 'utf-8');
}

function getTodoSync(id) {
  if (!fs.existsSync(dbPath)) return null;
  const todos = fs.readFileSync(dbPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));
  
  const todo = todos.find(t => t.id === id);
  return todo ? JSON.stringify(todo, null, 2) : null;
}

function updateTodoSync(id, updates) {
  if (!fs.existsSync(dbPath)) return null;
  let todos = fs.readFileSync(dbPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));

  let updatedTodo = null;
  todos = todos.map(todo => {
    if (todo.id === id) {
      updatedTodo = {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return updatedTodo;
    }
    return todo;
  });

  fs.writeFileSync(dbPath, todos.map(t => JSON.stringify(t, null, 2)).join('\n'));
  return updatedTodo;
}

function deleteTodoSync(id) {
  if (!fs.existsSync(dbPath)) return false;
  const todos = fs.readFileSync(dbPath, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line));

  const filteredTodos = todos.filter(t => t.id !== id);
  fs.writeFileSync(dbPath, filteredTodos.map(t => JSON.stringify(t, null, 2)).join('\n'));
  return filteredTodos.length !== todos.length;
}

module.exports = {
  createTodoSync,
  getTodosSync,
  getTodoSync,
  updateTodoSync,
  deleteTodoSync
};
