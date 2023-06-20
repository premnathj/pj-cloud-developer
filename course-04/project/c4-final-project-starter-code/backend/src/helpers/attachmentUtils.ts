import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const s3 = new XAWS.S3({ signatureVersion: 'v4'});

export function getSignedUrl(todoId: string) {
    const bucket = process.env.ATTACHMENT_S3_BUCKET;
    const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
    
    const signedURLRequest = {
        Bucket: bucket,
        Key: todoId,
        Expires: urlExpiration
    };

    return s3.getSignedUrl('putObject', signedURLRequest);
}
