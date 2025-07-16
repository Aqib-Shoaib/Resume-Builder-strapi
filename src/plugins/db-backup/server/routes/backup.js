'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/backup',
    handler: 'backup.backupDatabase',
    config: {
      policies: [],
      auth: false, // You can lock it down later
    },
  },
];
