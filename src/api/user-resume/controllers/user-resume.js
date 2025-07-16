'use strict';

/**
 * user-resume controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { Parser } = require('json2csv');

module.exports = createCoreController('api::user-resume.user-resume', ({ strapi }) => ({
  async export(ctx) {
    const resumes = await strapi.entityService.findMany('api::user-resume.user-resume', {
      populate: '*', // include relations if needed
    });

    const parser = new Parser();
    const csv = parser.parse(resumes);

    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', 'attachment; filename="user-resumes.csv"');
    ctx.body = csv;
  },
}));
