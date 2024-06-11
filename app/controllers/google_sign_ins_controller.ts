import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

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

    const findUser = {
      email: user.email as string,
    }

    const userDetails = {
      name: user.name as string,
      email: user.email as string,
      avatar_url: user.avatarUrl as string,
      provider_id: user.id as string,
      provider: 'google',
    }

    const newUser = await User.firstOrCreate(findUser, userDetails)

    await auth.use('web').login(newUser)
    response.status(200)

    return newUser
  }
}
