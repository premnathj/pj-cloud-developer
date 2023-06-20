import 'source-map-support/register'
import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS);


export class TodosDB {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET
    ) { }

    async getAllTodos(userId) {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        return result.Items;
    }

    async getTodo(todoId, userId) {
        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise();

        return result.Item;
    }

    async addTodo(todoItem) {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise();
    }

    async updateTodo(todoId, userId, updatedTodo) {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :nameAttr, #dueDate = :dueDateAttr, #done = :doneAttr',
            ExpressionAttributeValues: {
                ':nameAttr': updatedTodo.name,
                ':dueDateAttr': updatedTodo.dueDate,
                ':doneAttr': updatedTodo.done
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            }
        }).promise();
    }

    async updateAttachmentToTodoItem(todoId: string, userId: string){
        const attachmentUrl: string = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    
        const params = {
            TableName: this.todosTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #attachmentUrl = :attachmentUrl",
            ExpressionAttributeNames: {
                "#attachmentUrl": "attachmentUrl"
            },
            ExpressionAttributeValues: {
                ":attachmentUrl": attachmentUrl
            },
            ReturnValues: "ALL_NEW"
        };
    
        const result = await this.docClient.update(params).promise();
    
        return result.Attributes;
    }

    async deleteTodo(todoId, userId) {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            }
        }).promise();
    }

}