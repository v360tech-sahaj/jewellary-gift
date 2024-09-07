import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import { ulid } from 'ulid'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Consumer extends compose(BaseModel, AuthFinder) {
  static connection = 'console'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare phone: string

  @column()
  declare password: string | null

  @column()
  declare provider_type: 'Google' | 'Facebook' | 'Twitter' | 'Apple'

  @column()
  declare provider_id: string

  @column()
  declare provider_token: string | null

  @column()
  declare provider_refresh_token: string | null

  @column()
  declare provider_avatar: string | null

  @column()
  declare two_factor_secret: string | null

  @column()
  declare two_factor_recovery_codes: string | null

  @column()
  declare two_factor_confirmed_at: string | null

  @column()
  declare enable_tfa: boolean

  @column()
  declare status: 'ACTIVE' | 'BLOCKED'

  @column.dateTime()
  declare email_verified_at: DateTime | null

  @column.dateTime()
  declare phone_verified_at: DateTime | null

  @column.dateTime()
  declare logged_at: DateTime | null

  @column()
  declare timezone: string

  @column()
  declare format_dt: string

  @column()
  declare format_d: string

  @column()
  declare format_t: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async add(payload: any) {
    try {
      await db.transaction(async () => {
        const data = {
          ...payload,
          code: ulid(),
          timezone: '',
          format_dt: '',
          format_d: '',
          format_t: '',
        }

        const consumer = new Consumer()

        consumer.fill(data)
        await consumer.save()
      })
    } catch (error) {
      console.error(error)
    }
  }
}
