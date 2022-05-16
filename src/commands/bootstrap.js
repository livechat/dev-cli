import fs from 'fs'
import gradient from 'gradient-string'
import { create } from './create'
import { auth } from './auth'
import { widget } from './widget'
import { chatActions } from './chat-actions'
import { chatBoosters } from './chat-boosters'
import { chatWebhooks } from './chat-webhooks'
import { appWebhooks } from './app-webhooks'
import { DevPlatformService } from '../services/dev-platform'

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
    DevPlatformService.installApp({ appId })
  }

  console.log(gradient.passion(`\n🚀 App bootstrapped 🚀\n`))
}
