import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code', 8).unique().notNullable()
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('gift_template_categories')
        .onUpdate('cascade')
        .onDelete('restrict')
      table.string('name', 16)
      table.tinyint('photos_min').notNullable().defaultTo(0)
      table.tinyint('photos_max').notNullable().defaultTo(0)
      table.string('thumbnail', 128).nullable()
      table.string('preview', 128).nullable()
      table.tinyint('vouchers_required').notNullable().defaultTo(1)
      table.string('note', 255).nullable()
      table.json('tags').nullable()
      table.json('meta').nullable()
      table.timestamps(true, true)
      table.timestamp('deleted_at').nullable()
      table.integer('created_by').unsigned().nullable()
      table.integer('updated_by').unsigned().nullable()
      table.integer('deleted_by').unsigned().nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
