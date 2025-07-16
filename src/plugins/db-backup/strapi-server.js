'use strict';

const plugin = require('./server');

module.exports = () => {

  return {
    register() {},

    bootstrap() {
        console.log('✅ db-backup plugin bootstrapped');
    },

    ...plugin, // ⬅️ Injects routes & controllers
  };
};
