import fetch from 'node-fetch'
import signale from 'signale'
import { loader } from '../lib/loader.js'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { getTextPrompt } from '../prompts/text.js'

export async function create(options) {
  const name = options.name || (await getTextPrompt('app name'))

  if (!name) {
    signale.error('name is required')
    return
  }

  try {
    loader.start(`creating app with name: '${name}'`)
    const data = await fetch(`${config.dpsApiUrl}/v2/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        name,
        origin: 'livechat',
      }),
    }).then((res) => res.json())

    loader.stop()
    signale.success(`app '${name}' created`)
    signale.info(`app id: ${data.id}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${data.id}`)
    return data.id
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
