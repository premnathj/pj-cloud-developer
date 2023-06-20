import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { getAllTodos as getTodosForUser } from '../../business-logic/todos';
import { getUserId } from '../utils';

const logger = createLogger('getTodo');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Get All TODOs', { event });
    const userId = getUserId(event);
    // Write your code here
    const todos = await getTodosForUser(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
);
