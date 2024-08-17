import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'mysql',
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
    console: {
      client: 'mysql2',
      connection: {
        host: 'ec2-13-235-48-14.ap-south-1.compute.amazonaws.com',
        port: 3306,
        user: 'alpha-app',
        password: 'Alpha@1234',
        database: 'console',
      },
    },
  },
})

export default dbConfig
