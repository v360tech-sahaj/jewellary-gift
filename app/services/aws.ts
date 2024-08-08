import fs from 'fs/promises'
import * as AWS from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'

const s3Client = new AWS.S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
})

export default class S3Service {
  public static async uploadToS3(fileName: string, filePath: string) {
    try {
      const file = await fs.readFile(filePath)

      await s3Client.send(
        new AWS.PutObjectCommand({
          Bucket: 'v360-test',
          Key: fileName,
          Body: file,
        })
      )
      console.log(`${fileName} Uploaded to S3`)
    } catch (error) {
      console.log('Failed to upload to S3', error)
    }
  }
}
