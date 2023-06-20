import * as uuid from 'uuid'

import { TodosDB } from '../data-access/todos-db';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { getSignedUrl } from '../helpers/attachmentUtils'

const todosDB = new TodosDB();

export async function getAllTodos(
    userId: string
) {
    return await todosDB.getAllTodos(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest,
    userId: string
) {

    const todoId = uuid.v4();
    return await todosDB.addTodo({
        userId,
        todoId,
        done: false,
        ...createTodoRequest,
        createdAt: new Date().toISOString()
    });
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    todoId: string,
    userId: string
) {
    return await todosDB.updateTodo(updateTodoRequest, todoId, userId);
}

export async function deleteTodo(
    todoId: string,
    userId: string
) {
    await todosDB.deleteTodo(todoId, userId);
}

export async function generateUploadUrl(todoId: string, userId: string) {
    await todosDB.updateAttachmentToTodoItem(todoId, userId);
    return getSignedUrl(todoId);
}