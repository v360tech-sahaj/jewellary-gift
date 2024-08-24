import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs/promises'
import S3Service from '#services/aws'

export default class CheckoutsController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')
    let details = session.get(gsId)

    // console.log('data at checkout index', session.get(gsId))
    return view.render('pages/summary', { details, gsId })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')
    const promoCode = request.input('promoCode')

    let details = session.get(gsId)

    try {
      if (details.files && Array.isArray(details.files)) {
        for (const file of details.files) {
          const { filePath, clientName } = file
          // Upload file to server
          await S3Service.uploadToS3(clientName, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.videos && Array.isArray(details.videos)) {
        for (const video of details.videos) {
          const { filePath, clientName } = video
          // Upload video to server
          await S3Service.uploadToS3(clientName, filePath)
          await fs.unlink(filePath)
        }
      }

      if (details.audios && Array.isArray(details.audios)) {
        for (const audio of details.audios) {
          const { filePath, clientName } = audio
          // Upload audio to server
          await S3Service.uploadToS3(clientName, filePath)
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
