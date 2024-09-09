import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.uuid('code').unique()
      table.integer('retailer_id').nullable()
      table.integer('consumer_id').notNullable()
      table
        .integer('voucher_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('gift_vouchers')
        .onUpdate('cascade')
        .onDelete('restrict')
      table
        .integer('template_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('gift_templates')
        .onUpdate('cascade')
        .onDelete('restrict')
      table.integer('graphics_asset_id').nullable()
      table.enum('status', ['REQUESTED', 'PROCESS', 'PROCESSED', 'READY', 'ERROR']).notNullable()
      table.string('note', 256).nullable()
      table.enum('resolution', ['W', 'S', 'V']).defaultTo('W')
      table.integer('assigned_to').nullable()
      table.timestamp('process_at').nullable()
      table.timestamp('processed_at').nullable()
      table.timestamp('ready_at').nullable()
      table.text('error').nullable()
      table.json('meta').nullable()
      table.timestamps(true, true)
      table.integer('created_by').unsigned().nullable()
      table.integer('updated_by').unsigned().nullable()
      table.integer('deleted_by').unsigned().nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
