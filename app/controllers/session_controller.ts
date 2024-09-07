import Consumer from '#models/consumer'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async login({ request, auth, response, session }: HttpContext) {
    // get credentials from the request body
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await Consumer.verifyCredentials(email, password)

      // login user
      await auth.use('web').login(user)
      // redirect
      return response.redirect().toRoute('home')  
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: error,
      })
      return response.redirect().back()
    }
  }
}
