/* eslint-env node */
const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary'),
  ]).then(urls => {
    return {
      packageManager: 'pnpm',
      scenarios: [
        embroiderSafe(),
        embroiderOptimized(),
        {
          name: 'ember-lts-3.28',
          npm: {
            devDependencies: {
              'ember-source': '~3.28.0',
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-4.4",
          npm: {
            devDependencies: {
              "ember-source": "~4.4.5",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-4.8",
          npm: {
            devDependencies: {
              "ember-source": "~4.8.0",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-4.12",
          npm: {
            devDependencies: {
              "ember-source": "~4.12.0",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-5.4",
          npm: {
            devDependencies: {
              "ember-source": "~5.4.0",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-5.8",
          npm: {
            devDependencies: {
              "ember-source": "~5.8.0",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-lts-5.12",
          npm: {
            devDependencies: {
              "ember-source": "~5.12.0",
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: "ember-release",
          npm: {
            devDependencies: {
              'ember-source': urls[0],
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: 'ember-beta',
          npm: {
            devDependencies: {
              'ember-source': urls[1],
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: 'ember-canary',
          npm: {
            devDependencies: {
              'ember-source': urls[2],
            },
          },
          pnpm: {
            patchedDependencies: {},
          },
        },
        {
          name: 'ember-default',
          npm: {
            devDependencies: {},
          },
        },
      ]
    };
  });
};
