import App from './admin/src/pages/App/index.jsx';

export default {
  register(app) {
    app.addMenuLink({
      to: '/plugins/db-backup',
      icon: () => '🗄️', // or use an actual icon component
      intlLabel: {
        id: 'db-backup.plugin.name',
        defaultMessage: 'DB Backup',
      },
      Component: App,
      permissions: [],
    });
  },

  bootstrap() {},
};
