import fs from 'fs/promises'
import * as AWS from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new AWS.S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
})

export default class S3Service {
  public static async uploadToS3(s3Path: string, filePath: string) {
    try {
      const file = await fs.readFile(filePath)

      await s3Client.send(
        new AWS.PutObjectCommand({
          Bucket: 'v360-test',
          Key: s3Path,
          Body: file,
        })
      )
      console.log(`${s3Path} Uploaded to S3`)
    } catch (error) {
      console.log('Failed to upload to S3', error)
    }
  }

  public static async getPublicUrl(filePath: string): Promise<string | null> {
    try {
      const command = new AWS.GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: filePath,
      })

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 15 })
      return url
    } catch (error) {
      console.error('Failed to generate public URL', error)
      return null
    }
  }
}
