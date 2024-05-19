const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./db');
const PORT = process.env.PORT || 7000;
const models = require('./migrations/20240513065044_user_table');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const fileUpload = require('express-fileupload');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);
app.use(errorHandler);


const start = async () => {
  try {
      await sequelize.authenticate();
      await sequelize.sync();
      app.listen(PORT, () => console.log(`Server started on port ${PORT}, and 'Welcome to My Cafe API'`));
  } catch (e) {
      console.log(e);
  }
}
start();