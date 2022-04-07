import fetch from 'node-fetch'
import signale from 'signale'
import { store } from '../lib/store.js'
import { loader } from '../lib/loader.js'
import { config } from '../lib/config.js'
import { getAppIdPrompt } from '../prompts/app-id.js'

export async function remove(options) {
  const appId = options.appId ?? (await getAppIdPrompt())

  try {
    loader.start(`removing app with id: '${appId}'`)

    await fetch(`${config.dpsApiUrl}/v2/applications/${appId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
    }).then((res) => res.json())

    loader.stop()
    signale.success(`app '${appId}' deleted`)
  } catch (error) {
    signale.error(error.message)
  }
}
