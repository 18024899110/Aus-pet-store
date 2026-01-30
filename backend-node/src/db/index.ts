import { Sequelize } from 'sequelize';
import config from '../config';

let sequelize: Sequelize;

if (config.database.dialect === 'sqlite') {
  const dbPath = config.database.url.replace('sqlite:', '');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: config.env === 'development' ? console.log : false,
  });
} else if (config.database.dialect === 'mysql') {
  sequelize = new Sequelize(config.database.url, {
    dialect: 'mysql',
    logging: config.env === 'development' ? console.log : false,
  });
} else {
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: config.env === 'development' ? console.log : false,
  });
}

export default sequelize;
