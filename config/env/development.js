module.exports = {
  env: 'development',
  port: process.env.PORT || 3000,
  logger: true,
  initData: true,
  mongoDB: undefined,
  db: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '12345678',
    host: process.env.MYSQL_1_PORT_3306_TCP_ADDR || '127.0.0.1',
    port: process.env.MYSQL_1_PORT_3306_TCP_PORT || 3306,
    database: 'fruit-tart',
    dialect: 'mysql',
    force: true,
    logging: false,
    timezone: '+08:00',
  },
};
