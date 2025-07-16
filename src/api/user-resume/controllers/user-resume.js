'use strict';

/**
 * user-resume controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { Parser } = require('json2csv');
const fs = require('fs');
const { parse } = require('csv-parse/sync');

module.exports = createCoreController('api::user-resume.user-resume', ({ strapi }) => ({
  async export(ctx) {
    const resumes = await strapi.entityService.findMany('api::user-resume.user-resume', {
      populate: '*',
    });

    const parser = new Parser();
    const csv = parser.parse(resumes);

    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', 'attachment; filename="user-resumes.csv"');
    ctx.body = csv;
  },

 async import(ctx) {
    try {
      const file = ctx.request?.files?.file;

      if (!file || !file.filepath) {
        return ctx.badRequest('CSV file is required.');
      }

      console.log('📁 File received:', file.filepath);

      // Read CSV content
      const content = fs.readFileSync(file.filepath, 'utf-8');

      // Parse CSV to JSON
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
      });

      console.log('✅ Parsed Records Count:', records.length);

      // Clean and normalize records
      const cleanedRecords = records.map((record) => {
        const {
          id, createdAt, updatedAt, publishedAt,
          createdBy, updatedBy, localizations,
          Education, Experience, skills,
          ...rest
        } = record;

        return {
          ...rest,
          Education: parseSafeJson(Education),
          Experience: parseSafeJson(Experience),
          skills: parseSafeJson(skills),
        };
      });

      // Insert entries one by one
      const created = await Promise.all(
        cleanedRecords.map((data) =>
          strapi.entityService.create('api::user-resume.user-resume', { data })
        )
      );

      console.log(`✅ Import successful. Created ${created.length} records.`);
      return ctx.send({ status: 'success', count: created.length });

    } catch (error) {
      console.error('💥 Import failed:', error);
      return ctx.internalServerError('Import failed');
    }
  }
  
  
}));

// Helper to safely parse JSON strings
function parseSafeJson(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('⚠️ Failed to parse JSON:', value);
    return [];
  }
}
