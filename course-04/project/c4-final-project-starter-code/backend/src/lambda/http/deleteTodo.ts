import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { deleteTodo } from '../../business-logic/todos';
import { getUserId } from '../utils';
const logger = createLogger('deleteTodo');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Delete a ToDo Item', { event });
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    await deleteTodo(todoId, userId);

    return {
      statusCode: 204,
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
