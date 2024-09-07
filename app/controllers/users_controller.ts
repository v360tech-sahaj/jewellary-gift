import Consumer from '#models/consumer'
import { registerUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display home page
   */
  async home({ view }: HttpContext) {
    return view.render('pages/home')
  }

  /**
   * Register a User
   */
  async create({ view }: HttpContext) {
    return view.render('pages/register')
  }

  /**
   * Crete a registered user
   */
  async store({ request, response, session }: HttpContext) {
    //validation
    const payload = await request.validateUsing(registerUserValidator)

    try {
      let hasErrors = false

      // Check if the phone number already exists
      const phoneExists = await Consumer.query().where('phone', payload.phone).first()
      if (phoneExists) {
        session.flash('phoneError', {
          type: 'error',
          message: 'The phone number is already in use.',
        })
        hasErrors = true
      }

      // Check if the email already exists
      const emailExists = await Consumer.query().where('email', payload.email).first()
      if (emailExists) {
        session.flash('emailError', {
          type: 'error',
          message: 'The email address is already in use.',
        })
        hasErrors = true
      }

      if (hasErrors) {
        return response.redirect().back()
      }

      // Create a new user
      await Consumer.add(payload)
      response.redirect().toRoute('login')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: error,
      })
      response.redirect().back()
    }
  }

  async login({ view }: HttpContext) {
    return view.render('pages/login')
  }
}
