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
    const assetNumbers = details['assetNumbers']

    return view.render('pages/assets/create', { gsId, assetNumbers })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')

    let assetNumbers = request.input('assetNumbers')
    if (!Array.isArray(assetNumbers)) {
      assetNumbers = [assetNumbers]
    }

    //put asset numbers in session
    let details = session.get(gsId)
    details = { ...details, assetNumbers }

    session.put(gsId, details)

    return response.redirect().toRoute('templates.index', { gsId })
  }
}
