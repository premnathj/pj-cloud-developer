import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { updateTodo } from '../../business-logic/todos';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import { getUserId } from '../utils';
const logger = createLogger('updateTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Updating a TODO item', { todo: event.body });
    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    const userId = getUserId(event);
     // Validation
     if (!updatedTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ToDo name is required'
        })
      };
    }
    if (!updatedTodo.dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ToDo dueDate is required'
        })
      };
    }

    await updateTodo(updatedTodo, todoId, userId);
    return {
      statusCode: 200,
      body: JSON.stringify({})
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
