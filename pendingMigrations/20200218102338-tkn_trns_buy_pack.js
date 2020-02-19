"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable("tokenTransferBuyPackages", {
      uniqueId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
      },

      recipientClientId: {
        type: Sequelize.STRING,
        allowNull: false
      },

      tokenAmount: {
        type: Sequelize.STRING,
        allowNull: false
      },

      fromAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },

      tokenName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      toAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },

      // !use camel case
      transaction_hash: {
        type: Sequelize.STRING,
        allowNull: true
      },

      tokenTransferStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
