'use strict';
module.exports = (sequelize, DataTypes) => {
  const usersArtworks = sequelize.define('usersArtworks', {
    userId: DataTypes.INTEGER,
    artworkId: DataTypes.INTEGER
  }, {});
  usersArtworks.associate = function(models) {
    // associations can be defined here
  };
  return usersArtworks;
};
