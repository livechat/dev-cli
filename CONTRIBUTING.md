# 🏗 Contributing

## Proposing a Change

In order to propose a change or request new feature we recommend filling the [Feature request](https://github.com/livechat/chat-widget-adapters/issues/new/choose).

## Reporting a Bug

We track public bugs in [GitHub Issues](https://github.com/livechat/chat-widget-adapters/issues). If you would like to report one we recommend filling the [Bug report](https://github.com/livechat/chat-widget-adapters/issues/new/choose).

## Development Workflow

- Install the dependecies using `npm install`.

- Start watch mode running `npm start`.

- Build the application using `npm run build` at the top level.

- Link packge locally for testing the build using `npm link` at the top level.

## Versioning

This project uses [semantic versioning](https://semver.org/). In order to properly update package to a new version checkout to `main` branch and run `npm version [<newversion> | major | minor | patch]`. It will update the package making changes in `package*.json` files.

## Comitting

The project is set up with a code quality tools like [`prettier`](https://npm.im/prettier) and [`eslint`](https://npm.im/eslint). They are being automatically run against changed files on `pre-commit` hook.

## Branch Organization

Submit all changes directly to the `main` branch. We don’t use separate branches for development or for upcoming releases.

## Sending a Pull Request

This project uses a GitHub Actions setup to run on each commit `push` which triggers `lint` and `build` scripts. Checks must pass in order to unlock merging.

## File structure

```
src
└─── lib          // utility functions
└─── commands     // functions encapsulating each specfic command logic
└─── prompts      // functions gathering data from the user via interactive prompts
└─── services     // async function for APIs requests
└─── main.js      // application main entry point
└─── dist
    └─── bin.mjs  // bundled application code in executable format
```

## Testing

### Manual testing

In order to manually test introduced changes build the application and then prepare an installable tarball using `npm pack`. After that you can install the app locally, inside chosen npm project, or globally using `npm intall <package-name.tgz>` or `npm install -g <package-name.tgz>`
