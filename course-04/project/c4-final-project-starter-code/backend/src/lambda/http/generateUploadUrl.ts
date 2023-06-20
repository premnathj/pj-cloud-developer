import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as middy from 'middy';
import { cors, httpErrorHandler } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';
import { generateUploadUrl } from '../../business-logic/todos';
import { getUserId } from '../utils';
const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Generate UploadUrl', { event })
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);

    const uploadUrl = await generateUploadUrl(todoId, userId);
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    

    return {
      statusCode: 200,
      body: JSON.stringify({
          uploadUrl: uploadUrl,
      })
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );
