'use strict';

const backupRoutes = require('./routes/backup.js');
const backupController = require('./controllers/backup.js');

console.log('🧪 Registering plugin: db-backup');

module.exports = {
  routes: backupRoutes,
  controllers: {
    backup: backupController,
  },
};
