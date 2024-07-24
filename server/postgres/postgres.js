import {Sequelize} from 'sequelize'
import { userModel } from '../schema/user.js';

const sequelize = new Sequelize('Utsav', '', '', {
    host: 'localhost',
    dialect: 'postgres'
  });

  let UserModel = null;
  const connection =async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        UserModel = await userModel(sequelize)
        await sequelize.sync()
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
  }

  export {
    connection, UserModel
  }