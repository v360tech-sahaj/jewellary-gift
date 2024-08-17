import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_request_assets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('request_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('gift_requests')
        .onUpdate('cascade')
        .onDelete('cascade')
      table.integer('asset_code').notNullable()
      table.integer('graphics_asset_id').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
