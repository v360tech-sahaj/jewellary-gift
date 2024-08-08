import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs/promises'
import S3Service from '#services/aws'

export default class CheckoutsController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')
    let details = session.get(gsId)

    return view.render('pages/summary', { details, gsId })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')
    const promoCode = request.input('promoCode')

    let details = session.get(gsId)
    if (details.file) {
      const filePath = details.file.filePath
      const fileName = details.file.clientName

      // Upload file to server
      await S3Service.uploadToS3(fileName, filePath)
      await fs.unlink(filePath)
    }

    if (details.video) {
      const videoPath = details.video.filePath
      const videoName = details.video.clientName

      // Upload video to server
      await S3Service.uploadToS3(videoName, videoPath)
      await fs.unlink(videoPath)
    }
    await fs.rmdir(`uploads/${gsId}`)

    const paidAmt = details.price - promoCode
    details = { ...details, promoCode, paidAmt }
    session.put(gsId, details)

    let giftSession = session.get(gsId)
    console.log('Gift Session :', giftSession)

    session.clear()
    return response.redirect().toRoute('home')
  }
}
