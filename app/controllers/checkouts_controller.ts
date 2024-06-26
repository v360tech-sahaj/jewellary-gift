import type { HttpContext } from '@adonisjs/core/http'

export default class CheckoutsController {
  public async index({ view, session }: HttpContext) {
    let giftSession = session.get('giftSession')

    return view.render('pages/summary', { giftSession })
  }

  public async store({ response, session }: HttpContext) {
    let giftSession = session.get('giftSession')
    console.log('Gift Session :', giftSession)

    session.clear()
    return response.redirect().toRoute('home')
  }
}
