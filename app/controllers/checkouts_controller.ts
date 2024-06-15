import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
  public async index({ view, session }: HttpContext) {
    const asset = session.get('assetNumber')
    const template = session.get('template')
    const message = session.get('message')
    const file = session.get('file')
    const video = session.get('video')
    console.log('Asset Number: "', asset, '"')
    console.log('Template: "', template, '"')
    console.log('Message: "', message, '"')
    console.log('File: "', file, '"')
    console.log('Video: "', video, '"')
    return view.render('pages/summary', { asset, template, message })
  }

  public async store({ response, session }: HttpContext) {
    session.clear()
    return response.redirect().toRoute('home')
  }
}
