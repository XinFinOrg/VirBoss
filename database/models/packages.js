'use strict';
module.exports = (sequelize, DataTypes) => {
  const packages = sequelize.define('packages', {
    uniqueId:{
      allowNull:false,
      primaryKey: true,
      type:DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currencyName:
    {
      type:DataTypes.STRING,
      validate:
      {
        isEmail: true,    // checks for email format (foo@bar.com)
      },
      allowNull:false,
    },
    amount:
    {
      type:DataTypes.FLOAT,
      allowNull:false,
    },
    referralAmount:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    referredAmount:{
      type:DataTypes.FLOAT,
      allowNull:false
    },
    status:
    {
      type:DataTypes.BOOLEAN,
      defaultValue:true,
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
    },
}, {});
  packages.associate = function (models) {
    
  };
  return packages;
};
