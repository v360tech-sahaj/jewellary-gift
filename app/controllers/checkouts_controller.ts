import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
  public async index({ request, view, session }: HttpContext) {
    const gsId = request.param('gsId')
    let details = session.get(gsId)

    return view.render('pages/summary', { details, gsId })
  }

  public async store({ request, response, session }: HttpContext) {
    const gsId = request.param('gsId')
    const promoCode = request.input('promoCode')

    let details = session.get(gsId)
    const paidAmt = details.price - promoCode
    details = { ...details, promoCode, paidAmt }
    session.put(gsId, details)

    let giftSession = session.get(gsId)
    console.log('Gift Session :', giftSession)

    session.clear()
    return response.redirect().toRoute('home')
  }
}
