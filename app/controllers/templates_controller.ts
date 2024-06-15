import type { HttpContext } from '@adonisjs/core/http'

export default class TemplatesController {
  public async index({ view, session }: HttpContext) {
    const template = session.get('template')
    return view.render('pages/templates/templates', { template })
  }

  public async store({ request, session, response }: HttpContext) {
    const payload = request.except(['_csrf'])
    const template = payload.template
    session.put('template', template)
    return response.redirect().toRoute('templates_details.index')
  }
}
