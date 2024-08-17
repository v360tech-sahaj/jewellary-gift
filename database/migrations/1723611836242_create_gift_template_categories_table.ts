import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'gift_template_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('parent_id').unsigned().nullable()
      table.string('name', 64).unique()
      table.string('note', 255).nullable()
      table.timestamps(true, true)
      table.integer('created_by').unsigned().nullable()
      table.integer('updated_by').unsigned().nullable()
      table.integer('deleted_by').unsigned().nullable()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('parent_id')
        .references('id')
        .inTable(this.tableName)
        .onUpdate('cascade')
        .onDelete('set null')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('parent_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
