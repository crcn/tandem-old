import { ApplicationFragment, KeyCommandFragment } from 'editor/fragment/types';

export default ApplicationFragment.create({
  id: 'appKeyCommands',
  factory: {
    create: create
  }
});

function create({ app }) {
  app.fragments.push(

    // TODO - need to use meta instead of alt here
    KeyCommandFragment.create({
      id: 'toggleLayersCommand',
      keyCommand: 'alt+\\',
      notifier: {
        notify: function() {
          app.setProperties({
            hideLeftSidebar: !app.hideLeftSidebar
          });
        }
      }
    }),

    KeyCommandFragment.create({
      id: 'toggleLayersCommand',
      keyCommand: 'alt+/',
      notifier: {
        notify: function() {
          app.setProperties({
            hideRightSidebar: !app.hideRightSidebar
          });
        }
      }
    })
  );
}
