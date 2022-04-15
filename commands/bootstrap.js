import fs from 'fs'
import fetch from 'node-fetch'
import gradient from 'gradient-string'
import { config } from '../lib/config.js'
import { store } from '../lib/store.js'
import { create } from './create.js'
import { auth } from './auth.js'
import { widget } from './widget.js'
import { chatActions } from './chat-actions.js'
import { chatBoosters } from './chat-boosters.js'
import { chatWebhooks } from './chat-webhooks.js'
import { appWebhooks } from './app-webhooks.js'

const steps = [auth, widget, chatActions, chatBoosters, chatWebhooks, appWebhooks]

export async function bootstrap({ configPath, baseURL, install }) {
  let configRaw = fs.readFileSync(configPath, { encoding: 'utf-8' })
  configRaw = configRaw.replace(new RegExp('%baseURL%', 'ig'), baseURL || JSON.parse(configRaw).baseURL)

  const appConfig = JSON.parse(configRaw)

  const appId = appConfig.appId ?? (await create({ name: appConfig.name }))

  if (!appId) {
    process.exit(1)
  }

  for (const step of steps) {
    if (step.name in appConfig) {
      const stepConfig = appConfig[step.name]
      if (Array.isArray(stepConfig)) {
        for (const stepSubconfig of stepConfig) {
          await step({ appId, ...stepSubconfig })
        }
      } else {
        await step({ appId, ...stepConfig })
      }
    }
  }

  if (install) {
    await fetch(`${config.dpsApiUrl}/v2/applications/${appId}/install`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${store.get('access_token')}` },
    })
  }

  console.log(gradient.passion(`\n🚀 App bootstrapped 🚀\n`))
}
