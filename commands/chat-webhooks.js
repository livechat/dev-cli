import signale from 'signale'
import fetch from 'node-fetch'
import { loader } from '../lib/loader.js'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { fetchApp } from '../lib/fetch-app.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getURLPrompt } from '../prompts/url.js'
import { getTextPrompt } from '../prompts/text.js'
import { getChatWebhookActionsPrompt } from '../prompts/chat-webhook-actions.js'

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
    const app = await fetchApp(appId)
    const webhooks = await fetch(`${config.lcApiUrl}/v3.3/configuration/action/list_webhooks`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({ owner_client_id: app.authorization.clientId }),
    }).then((res) => res.json())

    if (webhooks.error) {
      throw new Error(webhooks.error.message)
    }

    for (const webhook of webhooks) {
      const { error } = await fetch(`${config.lcApiUrl}/v3.3/configuration/action/unregister_webhook`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${store.get('access_token')}`,
        },
        body: JSON.stringify({
          id: webhook.id,
          owner_client_id: app.authorization.clientId,
        }),
      }).then((res) => res.json())

      if (error) {
        throw new Error(error)
      }
    }

    for (const action of actions) {
      const { error } = await fetch(`${config.lcApiUrl}/v3.3/configuration/action/register_webhook`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${store.get('access_token')}`,
        },
        body: JSON.stringify({
          url,
          action,
          type: 'license',
          secret_key: secret,
          owner_client_id: app.authorization.clientId,
        }),
      }).then((res) => res.json())

      if (error) {
        console.log(JSON.stringify(error))
        throw new Error(error)
      }
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
