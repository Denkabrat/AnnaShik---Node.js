const sequelize = require('../db');
const {
  DataTypes
} = require('sequelize');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
});
const Good = sequelize.define('good', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
});
const Type = sequelize.define('type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
});

Type.hasMany(Good);
Good.belongsTo(Type);

module.exports = {
  User,
  Good,
  Type
}