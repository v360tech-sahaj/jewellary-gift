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

        const assetCodes = Array.isArray(data.requestedAsset)
          ? data.requestedAsset
          : [data.requestedAsset]

        // Add request assets
        for (const assetCode of assetCodes) {
          const asset = new GiftRequestAsset()
          asset.request_id = request.id
          asset.asset_code = assetCode
          asset.useTransaction(trx)
          await asset.save()
          console.log('data added in assets')
        }

        // Add request resources
        // Handle and upload video details to db
        if (data.videos && Array.isArray(data.videos)) {
          for (const video of data.videos) {
            const resource = new GiftRequestResource()
            resource.request_id = request.id
            resource.resource_type = 'VIDEO'
            resource.resource_key = video.fileName
            resource.storage_path = `gift/${request.id}/${video.fileName}`
            resource.meta = video.meta || null

            resource.useTransaction(trx)
            await resource.save()
            console.log(`${video.fileName} added in resources`)
          }
        }

        // Handle and upload audio details to db
        if (data.audios && Array.isArray(data.audios)) {
          for (const audio of data.audios) {
            const resource = new GiftRequestResource()
            resource.request_id = request.id
            resource.resource_type = 'AUDIO'
            resource.resource_key = audio.fileName
            resource.storage_path = `gift/${request.id}/${audio.fileName}`
            resource.meta = audio.meta || null

            resource.useTransaction(trx)
            await resource.save()
            console.log(`${audio.fileName} added in resources`)
          }
        }

        // Handle and upload image details to db
        if (data.images && Array.isArray(data.images)) {
          for (const image of data.images) {
            const resource = new GiftRequestResource()
            resource.request_id = request.id
            resource.resource_type = 'PHOTO'
            resource.resource_key = image.fileName
            resource.storage_path = `gift/${request.id}/${image.fileName}`
            resource.meta = image.meta || null

            resource.useTransaction(trx)
            await resource.save()
            console.log(`${image.fileName} added in resource`)
          }
        }

        // Upload messages to db
        if (data.messages && Array.isArray(data.messages)) {
          for (const message of data.messages) {
            const resource = new GiftRequestResource()
            resource.request_id = request.id
            resource.resource_type = 'TEXT'
            resource.content = message

            resource.useTransaction(trx)
            await resource.save()
            console.log(`message added in resources`)
          }
        }

        // Handle and upload file details to db
        if (data.files && Array.isArray(data.files)) {
          for (const file of data.files) {
            const resource = new GiftRequestResource()
            resource.request_id = request.id
            resource.resource_type = 'DOC'
            resource.resource_key = file.fileName
            resource.storage_path = `gift/${request.id}/${file.fileName}`
            resource.meta = file.meta || null

            resource.useTransaction(trx)
            await resource.save()
            console.log(`${file.fileName} added in resources`)
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
    return requestId
  }
}
