import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { createTodo } from '../../business-logic/todos';

const logger = createLogger('createTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Creating TODO Item', { todo: JSON.parse(event.body) });
    const userId = getUserId(event);
    const newTodo: CreateTodoRequest = JSON.parse(event.body);
    // TODO: Implement creating a new TODO item
    // Validation
    if (!newTodo.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ToDo name is required'
        })
      };
    }

    if (!newTodo.dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'ToDo dueDate is required'
        })
      };
    }

    const todo = await createTodo(newTodo, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
);
