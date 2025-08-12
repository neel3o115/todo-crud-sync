const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.txt');

console.log('DEBUG: Using THIS implementation of todo CRUD operations');

function createTodoSync(title) {
    console.log(`DEBUG: createTodoSync called with title: ${title}`);
    const newTodo = {
        id: Date.now().toString(),
        title: title,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const todoString = JSON.stringify(newTodo, null, 2);
    const fileExists = fs.existsSync(dbPath);
    const fileContent = fileExists ? fs.readFileSync(dbPath, 'utf8') : '';
    const separator = fileExists && fileContent.trim() ? '\n' : '';
    
    fs.appendFileSync(dbPath, separator + todoString);
    console.log(`DEBUG: Appended todo: ${todoString}`);
}

function getTodosSync() {
    console.log('DEBUG: getTodosSync called');
    if (!fs.existsSync(dbPath)) {
        console.log('DEBUG: db.txt does not exist, returning empty string');
        return '';
    }
    const content = fs.readFileSync(dbPath, 'utf8');
    console.log(`DEBUG: Returning content:\n${content}`);
    return content;
}

function getTodoSync(id) {
    console.log(`DEBUG: getTodoSync called with id: ${id}`);
    const todos = getTodosSync();
    if (!todos) {
        console.log('DEBUG: No todos found');
        return null;
    }
    
    const todoLines = todos.split('\n').filter(line => line.trim());
    for (const line of todoLines) {
        try {
            const todo = JSON.parse(line);
            if (todo.id === id) {
                console.log(`DEBUG: Found todo: ${line}`);
                return line;
            }
        } catch (e) {
            console.log(`DEBUG: Error parsing line: ${line}`);
            continue;
        }
    }
    console.log(`DEBUG: Todo with id ${id} not found`);
    return null;
}

function updateTodoSync(id, updates) {
    console.log(`DEBUG: updateTodoSync called with id: ${id}, updates: ${JSON.stringify(updates)}`);
    const todos = getTodosSync();
    if (!todos) {
        console.log('DEBUG: No todos to update');
        return false;
    }
    
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
                console.log(`DEBUG: Updating todo from ${line} to ${JSON.stringify(updatedTodo)}`);
                return JSON.stringify(updatedTodo, null, 2);
            }
            return line;
        } catch (e) {
            console.log(`DEBUG: Error parsing line: ${line}`);
            return line;
        }
    });
    
    if (updated) {
        fs.writeFileSync(dbPath, updatedTodos.join('\n'));
        console.log('DEBUG: Successfully updated todos');
        return true;
    }
    console.log('DEBUG: No matching todo found to update');
    return false;
}

function deleteTodoSync(id) {
    console.log(`DEBUG: deleteTodoSync called with id: ${id}`);
    const todos = getTodosSync();
    if (!todos) {
        console.log('DEBUG: No todos to delete');
        return false;
    }
    
    const todoLines = todos.split('\n').filter(line => line.trim());
    const initialLength = todoLines.length;
    const updatedTodos = todoLines.filter(line => {
        try {
            const todo = JSON.parse(line);
            return todo.id !== id;
        } catch (e) {
            console.log(`DEBUG: Error parsing line: ${line}`);
            return true;
        }
    });
    
    if (updatedTodos.length < initialLength) {
        fs.writeFileSync(dbPath, updatedTodos.join('\n'));
        console.log('DEBUG: Successfully deleted todo');
        return true;
    }
    console.log('DEBUG: No matching todo found to delete');
    return false;
}

module.exports = {
    createTodoSync,
    getTodosSync,
    getTodoSync,
    updateTodoSync,
    deleteTodoSync
};