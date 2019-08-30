'use strict';
module.exports = (sequelize, DataTypes) => {
  const artwork = sequelize.define('artwork', {
    objectID: DataTypes.INTEGER,
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    date: DataTypes.STRING
  }, {});
  artwork.associate = function(models) {
    // associations can be defined here
  };
  return artwork;
};