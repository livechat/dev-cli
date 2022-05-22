import signale from 'signale'
import { config } from '../lib/config'
import { loader } from '../lib/loader'
import { getAppIdPrompt } from '../prompts/app-id'
import { getURLPrompt } from '../prompts/url'
import { DevPlatformService } from '../services/dev-platform'

export async function appWebhooks(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const url = options.url ?? (await getURLPrompt('app webhook url'))

  if (!appId || !url) {
    signale.error('required data not provided')
    return
  }

  try {
    loader.start('setting up app webhooks')

    await DevPlatformService.updateAppWebhook({ appId, url })

    loader.stop()
    signale.success('app webhook added')
    signale.info(`app id: ${appId}`)
    signale.info(`app webhook url: ${url}`)
    signale.info(`${config.devConsoleUrl}/apps/${appId}/blocks/webhooks`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
