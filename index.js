const fs = require("fs");
const path = require("path");
const DB_FILE_PATH = path.join(__dirname, "db.txt");

const dbTextToJson = (text) => {
  const formattedString = `[${text.trim().split("\n}\n{").join("},{")}]`;
  return JSON.parse(formattedString);
};

const JsonToDbText = (Json) => {
  let text = "";
  Json.forEach((todo) => {
    text += JSON.stringify(todo, null, 2) + "\n";
  });
  return text;
};

const createTodoSync = (title) => {
  const now = new Date().toISOString();
  const newTodo = {
    id: Date.now(),
    title,
    isCompleted: false,
    createdAt: now,
    updatedAt: now
  };

  let todos = [];
  if (fs.existsSync(DB_FILE_PATH)) {
    const fileData = fs.readFileSync(DB_FILE_PATH, "utf-8").trim();
    if (fileData) {
      todos = dbTextToJson(fileData);
    }
  }

  todos.push(newTodo);
  fs.writeFileSync(DB_FILE_PATH, JsonToDbText(todos));
};

const getTodosSync = () => {
  if (!fs.existsSync(DB_FILE_PATH)) return "";
  return fs.readFileSync(DB_FILE_PATH, "utf-8");
};

const getTodoSync = (id) => {
  if (!fs.existsSync(DB_FILE_PATH)) return null;
  const data = dbTextToJson(fs.readFileSync(DB_FILE_PATH, "utf-8"));
  const todo = data.find((item) => item.id === id);
  return todo ? JSON.stringify(todo) : null;
};

const updateTodoSync = (id, updates) => {
  if (!fs.existsSync(DB_FILE_PATH)) return;
  let todos = dbTextToJson(fs.readFileSync(DB_FILE_PATH, "utf-8"));

  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
    return todo;
  });

  fs.writeFileSync(DB_FILE_PATH, JsonToDbText(todos));
};

const deleteTodoSync = (id) => {
  if (!fs.existsSync(DB_FILE_PATH)) return;
  let todos = dbTextToJson(fs.readFileSync(DB_FILE_PATH, "utf-8"));
  todos = todos.filter((todo) => todo.id !== id);
  fs.writeFileSync(DB_FILE_PATH, JsonToDbText(todos));
};
