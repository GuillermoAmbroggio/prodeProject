import app from './src/app';
import { sequelize } from './src/db/sequalize';
require('dotenv').config();

const port: number = Number(process.env.PORT) || 8000;

(async () => {
  await sequelize.sync({ force: true });

  app.listen(port, () => {
    console.log(`
    ###############################
    ###### listening at ${port} ######
    ###############################
    `);
  });
})();
