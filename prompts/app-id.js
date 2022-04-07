import fetch from 'node-fetch'
import signale from 'signale'
import prompts from 'prompts'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { loader } from '../lib/loader.js'

export async function getAppIdPrompt() {
  try {
    loader.start('loading apps')
    const apps = await fetch(`${config.dpsApiUrl}/v2/applications?filter=my`, {
      headers: { Authorization: `Bearer ${store.get('access_token')}` },
    }).then((res) => res.json())
    loader.stop()

    const { appId } = await prompts({
      type: 'autocomplete',
      name: 'appId',
      message: 'select the app to which to add the widget',
      choices: apps.map((app) => ({ value: app.id, title: app.name })),
    })

    return appId
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
