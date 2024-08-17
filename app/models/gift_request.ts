import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import GiftVoucher from './gift_voucher.js'
import GiftTemplate from './gift_template.js'
import Retailer from './retailer.js'
import Consumer from './consumer.js'
import GraphicsAsset from './graphics_asset.js'
import GraphicsMediaOperator from './graphics_media_operator.js'

export default class GiftRequest extends BaseModel {
  static connection = 'mysql'

  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: false })
  declare code: number

  @column()
  declare retailer_id: number | null

  @column()
  declare consumer_id: number

  @column()
  declare voucher_id: number | null

  @column()
  declare template_id: number

  @column()
  declare graphics_asset_id: number | null

  @column()
  declare status: 'REQUESTED' | 'PROCESS' | 'PROCESSED' | 'READY' | 'ERROR'

  @column()
  declare note: string | null

  @column()
  declare resolution: 'Widescreen' | 'Square' | 'Vertical'

  @column()
  declare request_videos: JSON | null

  @column()
  declare request_audios: JSON | null

  @column()
  declare request_photos: JSON | null

  @column()
  declare request_messages: JSON | null

  @column()
  declare request_doc: string | null

  @column()
  declare assigned_to: number | null

  @column.dateTime()
  declare process_at: DateTime | null

  @column.dateTime()
  declare processed_at: DateTime | null

  @column.dateTime()
  declare ready_at: DateTime | null

  @column()
  declare error: string | null

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

  @belongsTo(() => Retailer, { foreignKey: 'retailer_id' })
  declare retailerId: BelongsTo<typeof Retailer>

  @belongsTo(() => Consumer, { foreignKey: 'consumer_id' })
  declare consumerId: BelongsTo<typeof Consumer>

  @belongsTo(() => GiftVoucher, { foreignKey: 'voucher_id' })
  declare giftVoucher: BelongsTo<typeof GiftVoucher>

  @belongsTo(() => GiftTemplate, { foreignKey: 'template_id' })
  declare giftTemplate: BelongsTo<typeof GiftTemplate>

  @belongsTo(() => GraphicsAsset, { foreignKey: 'graphics_asset_id' })
  declare graphicAssetId: BelongsTo<typeof GraphicsAsset>

  @belongsTo(() => GraphicsMediaOperator, { foreignKey: 'assigned_to' })
  declare assignedTo: BelongsTo<typeof GraphicsMediaOperator>
}
