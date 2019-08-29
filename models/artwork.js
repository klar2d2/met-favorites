'use strict';
module.exports = (sequelize, DataTypes) => {
  const artwork = sequelize.define('artwork', {
    objectID: DataTypes.INTEGER,
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    date: DataTypes.INTEGER
  }, {});
  artwork.associate = function(models) {
    // associations can be defined here
    models.artwork.belongsToMany(models.user, { through: 'usersArtworks' })
  };
  return artwork;
};
