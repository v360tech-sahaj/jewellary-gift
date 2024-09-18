import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs/promises'
import S3Service from '#services/aws'
import GiftRequest from '#models/gift_request'
import { ulid } from 'ulid'

export default class CheckoutsController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')
    let details = session.get(gsId)

    return view.render('pages/summary', { details, gsId })
  }

  public async store({ request, response, session, auth }: HttpContext) {
    const gsId = request.param('gsId')
    const promoCode = request.input('promoCode')

    let details = session.get(gsId)

    const user = auth.user
    const consumerId = user ? user.id : null

    const payload = {
      code: ulid(),
      consumer_id: consumerId,
      template_id: details.templateId,
      requestedAsset: details.assetNumbers,
      files: details.files,
      images: details.images,
      videos: details.videos,
      audios: details.audios,
      messages: details.messages,
    }

    const requestId = await GiftRequest.add(payload)

    try {
      if (details.files && Array.isArray(details.files)) {
        for (const file of details.files) {
          const { filePath, clientName } = file
          const s3Path = `gift/${requestId}/${clientName}`

          // Upload file to server
          await S3Service.uploadToS3(s3Path, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.images && Array.isArray(details.images)) {
        for (const image of details.images) {
          const { filePath, clientName } = image
          const s3Path = `gift/${requestId}/${clientName}`

          // Upload image to server
          await S3Service.uploadToS3(s3Path, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.videos && Array.isArray(details.videos)) {
        for (const video of details.videos) {
          const { filePath, fileName } = video
          const s3Path = `gift/${requestId}/${fileName}`

          // Upload video to server
          await S3Service.uploadToS3(s3Path, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.audios && Array.isArray(details.audios)) {
        for (const audio of details.audios) {
          const { filePath, fileName } = audio
          const s3Path = `gift/${requestId}/${fileName}`

          // Upload audio to server
          await S3Service.uploadToS3(s3Path, filePath)
          await fs.unlink(filePath)
        }
      }
      await fs.rmdir(`uploads/${gsId}`)
    } catch (error) {
      console.error(error)
    }

    const paidAmt = details.price - promoCode
    details = { ...details, promoCode, paidAmt }
    session.put(gsId, details)

    let giftSession = session.get(gsId)
    console.log('Gift Session :', giftSession)

    session.clear()
    return response.redirect().toRoute('home')
  }
}
