import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
  public async index({ view, session }: HttpContext) {
    const template = session.get('template')
    return view.render('pages/summary', { template })
  }

  public async store({ response, session }: HttpContext) {
    // const asset = session.get('assetNumber')
    // const template = session.get('template')
    // const message = session.get('message')
    // const file = session.get('file')
    // const video = session.get('video')

    session.clear()
    return response.redirect().toRoute('home')
  }
}
