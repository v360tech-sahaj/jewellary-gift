import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_vouchers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code', 16).unique()
      table.integer('subscription_id')
      table.string('subscription_type', 8)
      table.integer('retailer_id').nullable()
      table.enum('status', ['AVAILABLE', 'ISSUED', 'REDEEMED', 'EXPIRED'])
      table.timestamp('expires_at').nullable()
      table.timestamp('issued_at').nullable()
      table.integer('issued_by').nullable()
      table.timestamp('redeemed_at').nullable()
      table.integer('redeemed_by').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
