import type { HttpContext } from '@adonisjs/core/http'

export default class TemplateDetailsController {
  public async index({ view, session }: HttpContext) {
    let giftSession = session.get('giftSession')
    const message = giftSession.message
    const file = giftSession.file
    const video = giftSession.video

    giftSession.message = message
    giftSession.file = file
    giftSession.video = video

    return view.render('pages/templates/templateDetails', { giftSession })
  }

  public async store({ request, session, response }: HttpContext) {
    let giftSession = session.get('giftSession')
    const payload = request.except(['_csrf'])
    const file = payload.file
    const message = payload.message
    const video = payload.video

    giftSession.file = file
    giftSession.message = message
    giftSession.video = video
    session.put('giftSession', giftSession)

    return response.redirect().toRoute('checkout.index', { giftSession })
  }
}
