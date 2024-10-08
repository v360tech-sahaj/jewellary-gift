import { HttpContext } from '@adonisjs/core/http'
import { ulid } from 'ulid'
import Consumer from '#models/consumer'

export default class GoogleSignInsController {
  public async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  public async handleCallback({ ally, auth, response }: HttpContext) {
    const googleUser = ally.use('google')

    // Unable to verify the CSRF state
    if (googleUser.stateMisMatch()) {
      return 'Request expired. try again'
    }

    // There was an unknown error during the redirect
    if (googleUser.hasError()) {
      return googleUser.getError()
    }

    // Finally, access the user
    const user = await googleUser.user()

    const code = ulid()

    const userDetails = {
      name: user.name as string,
      email: user.email as string,
      provider_id: user.id as string,
      provider_type: 'Google' as 'Google',
      provider_avatar: user.avatarUrl as string,
      code: code,
      phone: '',
      timezone: 'UTC',
      format_dt: '',
      format_d: '',
      format_t: '',
    }

    let consumer = await Consumer.findBy('email', user.email as string)
    if (!consumer) {
      consumer = await Consumer.create(userDetails)
    }

    await auth.use('web').login(consumer)
    return response.redirect('/')
  }
}
