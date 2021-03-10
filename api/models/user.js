'use strict';
const {
  Model
} = require('sequelize');
const PasswordEncryptor = require('../services/PasswordEncryptor')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserToken, {
        foreignKey: 'user_id',
        onDelete: 'cascade'
      })
    }

    comparePassword(pw) {
      const encryptor = new PasswordEncryptor()
      return encryptor.compare(pw, this.password_digest)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_digest: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password_digest'] }
    },
    scopes: {
      withSecretColumns: {
        attributes: { include: ['password_digest'] }
      }
    },
    setterMethods: {
      password(value) {
        const encryptor = new PasswordEncryptor()
        const digestedPassword = encryptor.encrypt(value)
        this.setDataValue('password_digest', digestedPassword)
      }
    }
  });
  return User;
};