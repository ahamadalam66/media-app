'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ GeneratedImage, Tag }) {
      // define association here
      this.hasMany(GeneratedImage, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: { name: 'media_id', key: 'id' },
      })

      this.hasMany(Tag, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        foreignKey: { name: 'media_id', key: 'id' },
      })
    }
  };
  Media.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    mime_type: DataTypes.STRING,
    size: DataTypes.INTEGER,
    dimensions: DataTypes.STRING,
    path: DataTypes.STRING,
    alt: DataTypes.STRING,
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Media',
    tableName: 'medias',
    createdAt: false,
    updatedAt: false,
  });
  return Media;
};