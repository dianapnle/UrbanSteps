'use strict'
const { Model, Validator } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Studio, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE',
        hooks: true,
      })
      User.hasMany(models.Instructor, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      })
      User.hasMany(models.Review, { foreignKey: 'userId' })
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true,
      })
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          //username must be between 4 to 30 characters
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.')
            }
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          //email must be between 3 to 256 characters
          len: [3, 256],
          isEmail: true,
        },
      },
      isInstructor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          //require 60 characters
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          //exclude these attributes
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
        },
      },
      validate: true,
    },
  )
  return User
}
