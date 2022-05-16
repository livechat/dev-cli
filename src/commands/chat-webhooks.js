import signale from 'signale'
import { loader } from '../lib/loader'
import { getAppIdPrompt } from '../prompts/app-id'
import { getURLPrompt } from '../prompts/url'
import { getTextPrompt } from '../prompts/text'
import { getChatWebhookActionsPrompt } from '../prompts/chat-webhook-actions'
import { DevPlatformService } from '../services/dev-platform'
import { ConfigurationApiService } from '../services/configuration-api'

export async function chatWebhooks(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const url = options.url ?? (await getURLPrompt('app webhook url'))
  const secret = options.secret ?? (await getTextPrompt('webhook secrete'))
  const actions = options.actions ?? (await getChatWebhookActionsPrompt())

  if (!appId || !actions || !secret || !url) {
    signale.error('required data not provided')
    return
  }

  loader.start('setting up chat webhooks')

  try {
    const app = await DevPlatformService.getApp({ appId })
    const webhooks = await ConfigurationApiService.listWebhooks({
      clientId: app.authorization.clientId,
    })

    for (const webhook of webhooks) {
      await ConfigurationApiService.unregisterWebhook({
        id: webhook.id,
        clientId: app.authorization.clientId,
      })
    }

    for (const action of actions) {
      await ConfigurationApiService.registerWebhook({
        clientId: app.authorization.clientId,
        action,
        secret,
        url,
      })
    }

    loader.stop()
    signale.success('chat webhooks added')
    signale.info(`app id: ${appId}`)
    signale.info(`chat webhook url: ${url}`)
    signale.info(`actions: `, actions.join(', '))
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/chat-webhooks`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
