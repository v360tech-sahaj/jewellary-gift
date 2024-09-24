import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'crypto'

export default class AssetsController {
  public async index({ session, response }: HttpContext) {
    const gsId = randomUUID()
    const details = {
      id: gsId,
    }
    session.put(gsId, details)
    return response.redirect().toRoute('assets.create', { gsId })
  }

  public async create({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')

    const details = session.get(gsId)
    const assetIdentifiers = details['assetIdentifiers']

    return view.render('pages/assets/create', { gsId, assetIdentifiers })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')

    let assetIdentifiers = request.input('assetIdentifiers')
    if (!Array.isArray(assetIdentifiers)) {
      assetIdentifiers = [assetIdentifiers]
    }

    //put asset numbers in session
    let details = session.get(gsId)
    details = { ...details, assetIdentifiers }

    session.put(gsId, details)

    return response.redirect().toRoute('templates.index', { gsId })
  }
}
