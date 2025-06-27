import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '54328'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'task_manager',
  entities: [__dirname + '/src/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/database/migrations/*.ts'],
});