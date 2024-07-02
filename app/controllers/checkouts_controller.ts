import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')
    let giftSession = session.get(gsId)

    return view.render('pages/summary', { giftSession, gsId })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')
    let giftSession = session.get(gsId)
    console.log('Gift Session :', giftSession)

    session.clear()
    return response.redirect().toRoute('home')
  }
}
