import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import GiftRequest from './gift_request.js'
import GraphicsAsset from './graphics_asset.js'
import AssetsProAsset from './assets_pro_asset.js'

export default class GiftRequestAsset extends BaseModel {
  static connection = 'mysql'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare request_id: number

  @column()
  declare asset_code: number

  @column()
  declare graphics_asset_id: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => GiftRequest, { foreignKey: 'request_id' })
  declare requestId: BelongsTo<typeof GiftRequest>

  @belongsTo(() => AssetsProAsset, { foreignKey: 'asset_code' })
  declare assetCode: BelongsTo<typeof AssetsProAsset>

  @belongsTo(() => GraphicsAsset, { foreignKey: 'graphics_asset_id' })
  declare graphicsAssetId: BelongsTo<typeof GraphicsAsset>

  // add assets
  static async addAssets(assetCodes: any[], requestId: number, trx: any) {
    const assetPromises = assetCodes.map(async (assetCode) => {
      const asset = new GiftRequestAsset()
      asset.request_id = requestId
      asset.asset_code = assetCode
      asset.useTransaction(trx)
      await asset.save()
      console.log('data added in assets')
    })

    await Promise.all(assetPromises)
  }
}
