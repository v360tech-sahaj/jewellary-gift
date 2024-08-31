import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, scope } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import GiftTemplate from './gift_template.js'
import GiftTextMessage from './gift_text_message.js'

export default class GiftTemplateMessage extends BaseModel {
  static connection = 'console'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare template_id: number

  @column()
  declare text_message_id: number

  @column()
  declare limit: number | null

  @column()
  declare is_required: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => GiftTemplate, { foreignKey: 'template_id' })
  declare giftTemplate: BelongsTo<typeof GiftTemplate>

  @belongsTo(() => GiftTextMessage, { foreignKey: 'text_message_id' })
  declare giftTextMessage: BelongsTo<typeof GiftTextMessage>

  static ofMessage = scope((query, template_id: number | null) => {
    if (template_id) {
      query.where('template_id', '=', template_id)
    }
  })
}
