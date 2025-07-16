'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/user-resumes/export',
      handler: 'user-resume.export',
      config: {
        auth: false, // or true if needed
      },
    },
  ],
};
