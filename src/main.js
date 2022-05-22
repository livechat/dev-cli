import yargs from 'yargs'
import gradient from 'gradient-string'
import boxen from 'boxen'
import { hideBin } from 'yargs/helpers'
import { login } from './commands/login'
import { bootstrap } from './commands/bootstrap'
import { init } from './commands/init'
import { create } from './commands/create'
import { widget } from './commands/widget'
import { remove } from './commands/remove'
import { auth } from './commands/auth'
import { appWebhooks } from './commands/app-webhooks'
import { chatWebhooks } from './commands/chat-webhooks'
import { chatActions } from './commands/chat-actions'
import { chatBoosters } from './commands/chat-boosters'
import { ensureToken } from './lib/ensure-token'

console.log(gradient.fruit(boxen('LiveChat Developer Console CLI', { padding: 1 }) + '\n'))

yargs(hideBin(process.argv))
  .command(
    'init [dirName]',
    'scaffold new LiveChat app project from template',
    (y) => y.positional('dirName', { type: 'string' }),
    init,
  )
  .command('login', 'login with your LiveChat account', {}, login)
  .command(
    'bootstrap',
    'bootstrap new LiveChat app using config file',
    (y) =>
      y
        .middleware(ensureToken)
        .options({
          configPath: { type: 'string' },
          baseURL: { type: 'string' },
          install: { type: 'boolean' },
        })
        .default({
          install: false,
          configPath: 'livechat.config.json',
        }),
    bootstrap,
  )
  .command(
    'create',
    'create new LiveChat app',
    (y) =>
      y.middleware(ensureToken).options({
        name: { type: 'string' },
      }),
    create,
  )
  .command(
    'widget',
    'setup agent app widget',
    (y) =>
      y.middleware(ensureToken).options({
        url: { type: 'string' },
        appId: { type: 'string' },
        placement: { type: 'string' },
      }),
    widget,
  )
  .command(
    'auth',
    'setup app authorization',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
        clientType: { type: 'string' },
        scopes: { type: 'array' },
        redirectURI: { type: 'array' },
      }),
    auth,
  )
  .command(
    'app-webhooks',
    'setup app webhooks',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
        url: { type: 'string' },
      }),
    appWebhooks,
  )
  .command(
    'chat-webhooks',
    'setup chat webhooks',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
        url: { type: 'string' },
        secret: { type: 'string' },
        actions: { type: 'array' },
      }),
    chatWebhooks,
  )
  .command(
    'chat-actions',
    'setup chat actions',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
        url: { type: 'string' },
        action: { type: 'string' },
        label: { type: 'string' },
      }),
    chatActions,
  )
  .command(
    'chat-boosters',
    'setup chat boosters',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
        url: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        ctaLabel: { type: 'string' },
      }),
    chatBoosters,
  )
  .command(
    'remove',
    'remove app',
    (y) =>
      y.middleware(ensureToken).options({
        appId: { type: 'string' },
      }),
    remove,
  )
  .parse()
