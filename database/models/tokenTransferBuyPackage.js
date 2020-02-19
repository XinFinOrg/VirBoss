'use strict';
module.exports = (sequelize, DataTypes) => {
  const tokenTransferBuyPackage = sequelize.define('tokenTransferBuyPackage', {
    uniqueId: {
      allowNull:false,
      primaryKey: true,
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },

    recipientClientId: {
      type:DataTypes.STRING,
      allowNull:false
    },

    tokenAmount: {
      type:DataTypes.STRING,
      allowNull:false,
    },

    fromAddress: {
      type:DataTypes.STRING,
      allowNull: false
    },

    tokenName: {
      type: DataTypes.STRING,
      allowNull:false
    },

    toAddress: {
      type:DataTypes.STRING,
      allowNull: false
    },

    // !use camel case
    transaction_hash: {
      type:DataTypes.STRING,
      allowNull:true,
    },

    tokenTransferStatus: {
      type:DataTypes.STRING,
      allowNull:true,
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:DataTypes.NOW
    }

  }, {});
  tokenTransferBuyPackage.associate = function(models){};
  return tokenTransferBuyPackage;
};
