import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AssetProAssets extends BaseModel {
  static connection = 'console'

  @column({ isPrimary: true })
  declare code: number

  @column()
  declare id: string

  @column()
  declare identifier: string

  @column()
  declare asset_name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
