'use strict';
module.exports = (sequelize, DataTypes) => {
  const collection = sequelize.define('collection', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});
  collection.associate = function(models) {
    // associations can be defined here
    models.collection.belongsTo(models.user)
    models.collection.belongsToMany(models.artwork, { through: 'collectionsArtworks'})
  };
  return collection;
};
