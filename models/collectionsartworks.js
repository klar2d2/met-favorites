'use strict';
module.exports = (sequelize, DataTypes) => {
  const collectionsArtworks = sequelize.define('collectionsArtworks', {
    collectionId: DataTypes.INTEGER,
    artworkId: DataTypes.INTEGER
  }, {});
  collectionsArtworks.associate = function(models) {
    // associations can be defined here
  };
  return collectionsArtworks;
};