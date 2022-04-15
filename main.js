#!/usr/bin/env node

import yargs from 'yargs'
import gradient from 'gradient-string'
import { hideBin } from 'yargs/helpers'
import { login } from './commands/login.js'
import { bootstrap } from './commands/bootstrap.js'
import { init } from './commands/init.js'
import { create } from './commands/create.js'
import { widget } from './commands/widget.js'
import { remove } from './commands/remove.js'
import { auth } from './commands/auth.js'
import { appWebhooks } from './commands/app-webhooks.js'
import { chatWebhooks } from './commands/chat-webhooks.js'
import { chatActions } from './commands/chat-actions.js'
import { chatBoosters } from './commands/chat-boosters.js'
import { ensureToken } from './lib/ensure-token.js'

console.log(gradient.passion('\nLiveChat Developer Console CLI\n'))

yargs(hideBin(process.argv))
  .command(
    'init [dirName]',
    'scafold new LiveChat app project from template',
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
