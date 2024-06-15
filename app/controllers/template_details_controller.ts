import type { HttpContext } from '@adonisjs/core/http'

export default class TemplateDetailsController {
  public async index({ view, session }: HttpContext) {
    const message = session.get('message')
    return view.render('pages/templates/templateDetails', { message })
  }

  public async store({ request, session, response }: HttpContext) {
    const payload = request.except(['_csrf'])
    const file = payload.file
    const message = payload.message
    const video = payload.video
    session.put('file', file)
    session.put('message', message)
    session.put('video', video)
    return response.redirect().toRoute('checkout.index')
  }
}
