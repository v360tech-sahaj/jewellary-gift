import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import GiftTemplateCategory from './gift_template_category.js'

export default class GiftTemplate extends BaseModel {
  static connection = 'console'

  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: false })
  declare code: string

  @column()
  declare category_id: number

  @column()
  declare name: string

  @column()
  declare photos_min: number

  @column()
  declare photos_max: number

  @column()
  declare thumbnail: string | null

  @column()
  declare preview: string | null

  @column()
  declare vouchers_required: number

  @column()
  declare note: string | null

  @column()
  declare tags: JSON | null

  @column()
  declare meta: JSON | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare deletedAt: DateTime

  @column()
  declare createdBy: number | null

  @column()
  declare updatedBy: number | null

  @column()
  declare deletedBy: number | null

  @belongsTo(() => GiftTemplateCategory, { foreignKey: 'category_id' })
  declare giftTemplateCategory: BelongsTo<typeof GiftTemplateCategory>
}
