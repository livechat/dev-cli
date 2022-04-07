import signale from 'signale'
import fetch from 'node-fetch'
import { loader } from '../lib/loader.js'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getURLPrompt } from '../prompts/url.js'

export async function appWebhooks(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const url = options.url ?? (await getURLPrompt('app webhook url'))

  if (!appId || !url) {
    signale.error('required data not provided')
    return
  }

  try {
    loader.start('setting up app webhooks')

    const { errors } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}/webhook`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({ url }),
    }).then((res) => res.json())

    if (errors) {
      throw new Error(errors)
    }

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
