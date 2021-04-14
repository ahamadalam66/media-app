'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Media }) {
      // define association here
      this.belongsTo(Media, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: { name: 'media_id', key: 'id' },
      })
    }
  };
  Tag.init({
    name: DataTypes.STRING,
    media_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags',
    createdAt: false,
    updatedAt: false,
  });
  return Tag;
};