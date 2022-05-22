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

const steps = [widget, chatActions, chatBoosters, chatWebhooks, appWebhooks]

export async function bootstrap({ configPath, baseURL, install }) {
  let configRaw = fs.readFileSync(configPath, { encoding: 'utf-8' })
  const ogConfig = JSON.parse(configRaw)
  configRaw = configRaw.replace(new RegExp('%baseURL%', 'ig'), baseURL || ogConfig.baseURL)

  let clientId = ''
  const appConfig = JSON.parse(configRaw)
  const appId = appConfig.appId || (await create({ name: appConfig.name }))

  if (!appId) {
    process.exit(1)
  }

  if ('auth' in appConfig) {
    clientId = await auth({ appId, ...appConfig.auth })
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

  if (install || appConfig.install) {
    DevPlatformService.installApp({ appId })
  }

  ogConfig.appId = appId
  ogConfig.baseURL = baseURL
  ogConfig.auth.clientId = clientId
  fs.writeFileSync(configPath, JSON.stringify(ogConfig, null, 2), { encoding: 'utf-8' })

  console.log(gradient.fruit(`\n🚀 App bootstrapped 🚀\n`))
}
