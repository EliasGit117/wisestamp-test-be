import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: configService.getOrThrow<string>('DB_URL'),
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsTableName: 'migrations',
  logging: process.env.ENV !== 'production',
  migrationsRun: false,
  extra: {
    connectionLimit: 10
  }
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;