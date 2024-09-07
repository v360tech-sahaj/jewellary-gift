import { HttpContext } from '@adonisjs/core/http'
import { ulid } from 'ulid'
import Consumer from '#models/consumer'

export default class TwitterSignInsController {
  public async redirect({ ally }: HttpContext) {
    return ally.use('twitter').redirect()
  }

  public async handleCallback({ ally, auth, response }: HttpContext) {
    const twitterUser = ally.use('twitter')

    // Unable to verify the CSRF state
    if (twitterUser.stateMisMatch()) {
      return 'Request expired. try again'
    }

    // There was an unknown error during the redirect
    if (twitterUser.hasError()) {
      return twitterUser.getError()
    }

    // Finally, access the user
    const user = await twitterUser.user()

    const code = ulid()

    const userDetails = {
      name: user.name as string,
      email: user.email as string,
      provider_id: user.id as string,
      provider_type: 'Twitter' as 'Twitter',
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
