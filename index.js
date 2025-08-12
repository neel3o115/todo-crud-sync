const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.txt');

function createTodoSync(title) {
    const newTodo = {
        id: Date.now(),
        title: title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const todoString = JSON.stringify(newTodo, null, 2);
    fs.appendFileSync(dbPath, (fs.existsSync(dbPath) && fs.readFileSync(dbPath, 'utf8').trim() ? '\n' : '') + todoString);
}

function getTodosSync() {
    if (!fs.existsSync(dbPath)) {
        return '';
    }
    return fs.readFileSync(dbPath, 'utf8');
}

function getTodoSync(id) {
    const todos = getTodosSync();
    if (!todos) return null;
    
    const todoLines = todos.split('\n').filter(line => line.trim());
    for (const line of todoLines) {
        try {
            const todo = JSON.parse(line);
            if (todo.id === id) {
                return line;
            }
        } catch (e) {
            continue;
        }
    }
    return null;
}

function updateTodoSync(id, updates) {
    const todos = getTodosSync();
    if (!todos) return false;
    
    const todoLines = todos.split('\n').filter(line => line.trim());
    let updated = false;
    const updatedTodos = todoLines.map(line => {
        try {
            const todo = JSON.parse(line);
            if (todo.id === id) {
                updated = true;
                const updatedTodo = {
                    ...todo,
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                return JSON.stringify(updatedTodo, null, 2);
            }
            return line;
        } catch (e) {
            return line;
        }
    });
    
    if (updated) {
        fs.writeFileSync(dbPath, updatedTodos.join('\n'));
        return true;
    }
    return false;
}

function deleteTodoSync(id) {
    const todos = getTodosSync();
    if (!todos) return false;
    
    const todoLines = todos.split('\n').filter(line => line.trim());
    const initialLength = todoLines.length;
    const updatedTodos = todoLines.filter(line => {
        try {
            const todo = JSON.parse(line);
            return todo.id !== id;
        } catch (e) {
            return true;
        }
    });
    
    if (updatedTodos.length < initialLength) {
        fs.writeFileSync(dbPath, updatedTodos.join('\n'));
        return true;
    }
    return false;
}

module.exports = {
    createTodoSync,
    getTodosSync,
    getTodoSync,
    updateTodoSync,
    deleteTodoSync
};