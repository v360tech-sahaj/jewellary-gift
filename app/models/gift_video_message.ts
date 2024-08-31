import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GiftVideoMessage extends BaseModel {
  static connection = 'console'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare title: string

  @column()
  declare max_duration: number | null

  @column()
  declare meta: JSON | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare createdBy: number | null

  @column()
  declare updatedBy: number | null

  @column()
  declare deletedBy: number | null
}
