"use strict";
module.exports = (sequelize, DataTypes) => {
  const siteConfig = sequelize.define(
    "siteConfig",
    {
      uniqueId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1
      },
      packagePrice: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1200000"
      },
      diversionAddress:{
        type: DataTypes.STRING,
      },
      diversionPrivKey:{
        type: DataTypes.STRING,
      },
      ethereumAddress: {
        type: DataTypes.STRING
      },
      ethereumPrivKey: {
        type: DataTypes.STRING
      },
      ropstenAddress: {
        type: DataTypes.STRING
      },
      ropstenPrivKey: {
        type: DataTypes.STRING
      },
      rinkebyAddress: {
        type: DataTypes.STRING
      },
      rinkebyPrivKey: {
        type: DataTypes.STRING
      },
      apothemAddress: {
        type: DataTypes.STRING
      },
      apothemPrivKey: {
        type: DataTypes.STRING
      },
      xinfinAddress: {
        type: DataTypes.STRING
      },
      xinfinPrivKey: {
        type: DataTypes.STRING
      },
      allKeys: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {}
  );
  siteConfig.associate = function(models) {};
  return siteConfig;
};
