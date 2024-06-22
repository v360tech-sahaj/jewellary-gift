import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'crypto'

export default class AssetsController {
  public async index({ view, session }: HttpContext) {
    const sessionId = randomUUID()
    // const assetNumber = session.get('assetNumber')
    let giftSession = session.get('giftSession')
    const assetNumber = giftSession.assetNumber

    // let giftSession = { sessionId, assetNumber }
    giftSession.sessionId = sessionId
    giftSession.assetNumber = assetNumber
    session.put('giftSession', giftSession)

    console.log(giftSession)
    return view.render('pages/assets/addAssets', { giftSession })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = request.except(['_csrf'])
    const assetNumber = payload.assetNumber
    let giftSession = session.get('giftSession')

    giftSession.assetNumber = assetNumber
    session.put('giftSession', giftSession)

    // return response.redirect().toRoute('templates.index', { giftSession })
  }
}
