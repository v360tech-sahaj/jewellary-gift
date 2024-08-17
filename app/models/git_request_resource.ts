import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import GiftRequest from './gift_request.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class GitRequestResource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare request_id: number

  @column()
  declare resource_type: 'AUDIO' | 'VIDEO' | 'PHOTO' | 'TEXT' | 'DOC'

  @column()
  declare resource_key: string | null

  @column()
  declare storage_path: string | null

  @column()
  declare content: string | null

  @column()
  declare meta: JSON | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => GiftRequest, { foreignKey: 'request_id' })
  declare retailerId: BelongsTo<typeof GiftRequest>
}
