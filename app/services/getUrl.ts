export default class getUrlService {
  public static getS3Url(key: string): string {
    const baseUrl = `https://v360-alpha-app.s3.${process.env.AWS_REGION}.amazonaws.com`
    return `${baseUrl}/${key}`
  }
}
