'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/user-resumes/export',
      handler: 'user-resume.export',
      config: {
        auth: false, // change to true if needed
      },
    },
    {
      method: 'POST',
      path: '/user-resumes/import',
      handler: 'user-resume.import',
      config: {
        auth: false, // change to true if needed
      },
    },
  ],
};
