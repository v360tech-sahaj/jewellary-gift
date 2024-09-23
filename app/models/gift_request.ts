import { DateTime } from 'luxon'
import { BaseModel, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import GiftVoucher from './gift_voucher.js'
import GiftTemplate from './gift_template.js'
import Retailer from './retailer.js'
import Consumer from './consumer.js'
import GraphicsAsset from './graphics_asset.js'
import GraphicsMediaOperator from './graphics_media_operator.js'
import db from '@adonisjs/lucid/services/db'
import GiftRequestAsset from './gift_request_asset.js'
import GiftRequestResource from './gift_request_resource.js'

export default class GiftRequest extends BaseModel {
  static connection = 'mysql'

  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: false })
  declare code: string

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

  @hasMany(() => GiftRequestAsset)
  declare requestedAsset: HasMany<typeof GiftRequestAsset>

  @hasMany(() => GiftRequestResource)
  declare videos: HasMany<typeof GiftRequestResource>

  @hasMany(() => GiftRequestResource)
  declare audios: HasMany<typeof GiftRequestResource>

  @hasMany(() => GiftRequestResource)
  declare images: HasMany<typeof GiftRequestResource>

  @hasMany(() => GiftRequestResource)
  declare messages: HasMany<typeof GiftRequestResource>

  @hasMany(() => GiftRequestResource)
  declare files: HasMany<typeof GiftRequestResource>

  static async add(payload: any) {
    let requestId
    try {
      await db.transaction(async (trx) => {
        const data = {
          ...payload,
          status: 'REQUESTED',
        }

        // Add request
        const request = new GiftRequest()
        request.fill(data)
        request.useTransaction(trx)
        await request.save()

        requestId = request.id

        // Add request assets
        const assetCodes = Array.isArray(data.requestedAsset)
          ? data.requestedAsset
          : [data.requestedAsset]

        await GiftRequestAsset.addAssets(assetCodes, requestId, trx)

        // Add request resources
        if (data.videos && Array.isArray(data.videos)) {
          await GiftRequestResource.storeResources(data.videos, requestId, 'VIDEO', trx)
        }

        if (data.audios && Array.isArray(data.audios)) {
          await GiftRequestResource.storeResources(data.audios, requestId, 'AUDIO', trx)
        }

        if (data.images && Array.isArray(data.images)) {
          await GiftRequestResource.storeResources(data.images, requestId, 'PHOTO', trx)
        }

        if (data.files && Array.isArray(data.files)) {
          await GiftRequestResource.storeResources(data.files, requestId, 'DOC', trx)
        }

        if (data.messages && Array.isArray(data.messages)) {
          await GiftRequestResource.storeMessages(data.messages, requestId, trx)
        }
      })
    } catch (error) {
      console.error(error)
    }
    return requestId
  }
}
