'use strict';

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = {
  async backupDatabase(ctx) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backup-${timestamp}.sql`;
      const backupDir = path.join(strapi.dirs.static.public, 'backups');

      // Ensure the backup folder exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const filePath = path.join(backupDir, fileName);

      // Load DB credentials from env
      const dbName = process.env.DATABASE_NAME;
      const dbUser = process.env.DATABASE_USERNAME;
      const dbPassword = process.env.DATABASE_PASSWORD;
      const dbHost = process.env.DATABASE_HOST;
      const dbPort = process.env.DATABASE_PORT || 5432;

      // Construct command
      const command = `pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -F c -b -v -f "${filePath}" ${dbName}`;

      // Use exec with env override
      exec(command, {
        env: {
          ...process.env,
          PGPASSWORD: dbPassword,
        },
      }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Backup failed:', error.message);
          return ctx.internalServerError('Backup failed');
        }

        console.log('✅ Backup succeeded:', stdout);
        const fileUrl = `/backups/${fileName}`;
        ctx.send({ url: fileUrl });
      });

    } catch (err) {
      console.error('💥 Unexpected error during backup:', err);
      ctx.internalServerError('Backup failed');
    }
  },
};
