import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Consumer from './consumer.js'
import Retailer from './retailer.js'

export default class GiftVoucher extends BaseModel {
  static connection = 'mysql'

  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: false })
  declare code: string

  @column()
  declare subscription_id: number

  @column()
  declare subscription_type: string

  @column()
  declare retailer_id: number | null

  @column()
  declare status: 'AVAILABLE' | 'ISSUED' | 'REDEEMED' | 'EXPIRED'

  @column.dateTime()
  declare expires_at: DateTime | null

  @column.dateTime()
  declare issued_at: DateTime | null

  @column()
  declare issued_by: number | null

  @column.dateTime()
  declare redeemed_at: DateTime | null

  @column()
  declare redeemed_by: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Retailer, { foreignKey: 'retailer_id' })
  declare retailerId: BelongsTo<typeof Retailer>

  @belongsTo(() => Consumer, { foreignKey: 'redeemed_by' })
  declare redeemedBy: BelongsTo<typeof Consumer>
}
