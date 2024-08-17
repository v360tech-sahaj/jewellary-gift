import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_request_resources'

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
      table.enum('resource_type', ['VIDEO', 'AUDIO', 'PHOTO', 'TEXT', 'DOC'])
      table.string('resource_key', 32).nullable()
      table.string('storage_path', 128).nullable()
      table.text('content').nullable()
      table.json('meta').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
