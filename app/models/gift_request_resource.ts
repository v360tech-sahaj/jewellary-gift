import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import GiftRequest from './gift_request.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

type ResourceType = 'AUDIO' | 'VIDEO' | 'PHOTO' | 'TEXT' | 'DOC'

export default class GiftRequestResource extends BaseModel {
  static connection = 'mysql'

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

  static async storeMultipleResources(items: any[], requestId: number, type: ResourceType, trx: any) {
    const resourcePromises = items.map(async (item: any) => {
      const resource = new GiftRequestResource()
      resource.request_id = requestId
      resource.resource_type = type
      if (type === 'TEXT') {
        resource.content = item
      } else {
        resource.resource_key = item.fileName
        resource.storage_path = `gift/${requestId}/${item.fileName}`
        resource.meta = item.meta
      }
      resource.useTransaction(trx)
      await resource.save()
    })

    await Promise.all(resourcePromises)
  }

  // add request resources
  static async storeSingleResource(messages: string[], requestId: number, trx: any) {
    const messagePromises = messages
      .filter((message) => message != null)
      .map(async (message) => {
        const resource = new GiftRequestResource()
        resource.request_id = requestId
        resource.resource_type = 'TEXT'
        resource.content = message
        resource.useTransaction(trx)
        await resource.save()
      })

    await Promise.all(messagePromises)
  }
}
