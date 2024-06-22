import type { HttpContext } from '@adonisjs/core/http'

export default class TemplatesController {
  public async index({ view, session }: HttpContext) {
    let giftSession = session.get('giftSession')
    const template = giftSession.template
    giftSession.template = template

    return view.render('pages/templates/templates', { giftSession })
  }

  public async store({ request, session, response }: HttpContext) {
    let giftSession = session.get('giftSession')
    const payload = request.except(['_csrf'])

    const template = payload.template
    giftSession.template = template
    session.put('giftSession', giftSession)

    return response.redirect().toRoute('templates_details.index', { giftSession })
  }
}
