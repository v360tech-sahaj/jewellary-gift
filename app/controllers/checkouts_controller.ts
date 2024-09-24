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
      requestedAsset: details.assetIdentifiers,
      files: details.files,
      images: details.images,
      videos: details.videos,
      audios: details.audios,
      messages: details.messages,
    }

    const requestId = await GiftRequest.add(payload)

    try {
      const uploadResources = async (items: any) => {
        for (const item of items) {
          const { filePath, fileName } = item
          const s3Path = `gift/${requestId}/${fileName}`

          await S3Service.uploadToS3(s3Path, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.files && Array.isArray(details.files)) {
        await uploadResources(details.files)
      }

      if (details.images && Array.isArray(details.images)) {
        await uploadResources(details.images)
      }

      if (details.videos && Array.isArray(details.videos)) {
        await uploadResources(details.videos)
      }

      if (details.audios && Array.isArray(details.audios)) {
        await uploadResources(details.audios)
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
