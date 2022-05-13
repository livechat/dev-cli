import signale from 'signale'
import { loader } from '../lib/loader.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getURLPrompt } from '../prompts/url.js'
import { DevPlatformService } from '../services/dev-platform.js'

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
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/webhooks`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
