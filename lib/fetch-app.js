import fetch from 'node-fetch'
import { config } from './config.js'
import { store } from './store.js'

export async function fetchApp(appId) {
  return fetch(`${config.dpsApiUrl}/v2/applications/${appId}`, {
    headers: { Authorization: `Bearer ${store.get('access_token')}` },
  }).then((res) => res.json())
}
