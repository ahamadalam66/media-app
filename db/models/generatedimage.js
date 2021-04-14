'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GeneratedImage extends Model {
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
  GeneratedImage.init({
    query: DataTypes.STRING,
    dimensions: DataTypes.STRING,
    path: DataTypes.STRING,
    media_id: DataTypes.INTEGER,
    generated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'GeneratedImage',
    tableName: 'generated_images',
    createdAt: false,
    updatedAt: false
  });
  return GeneratedImage;
};