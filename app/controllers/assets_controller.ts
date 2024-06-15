import type { HttpContext } from '@adonisjs/core/http'

export default class AssetsController {
  public async index({ view, session }: HttpContext) {
    const assetNumber = session.get('assetNumber')
    return view.render('pages/assets/addAssets', { assetNumber })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = request.except(['_csrf'])
    const assetNumber = payload.assetNumber
    session.put('assetNumber', assetNumber)
    return response.redirect().toRoute('templates.index')
  }
}
