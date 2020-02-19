"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable("siteConfigs", {
      uniqueId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
      },
      packagePrice: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "1200000"
      },
      diversionAddress: {
        type: Sequelize.STRING
      },
      diversionPrivKey: {
        type: Sequelize.STRING
      },
      ethereumAddress: {
        type: Sequelize.STRING
      },
      ethereumPrivKey: {
        type: Sequelize.STRING
      },
      ropstenAddress: {
        type: Sequelize.STRING
      },
      ropstenPrivKey: {
        type: Sequelize.STRING
      },
      rinkebyAddress: {
        type: Sequelize.STRING
      },
      rinkebyPrivKey: {
        type: Sequelize.STRING
      },
      apothemAddress: {
        type: Sequelize.STRING
      },
      apothemPrivKey: {
        type: Sequelize.STRING
      },
      xinfinAddress: {
        type: Sequelize.STRING
      },
      xinfinPrivKey: {
        type: Sequelize.STRING
      },
      allKeys: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
