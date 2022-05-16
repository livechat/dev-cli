import fetch from 'node-fetch'
import { config } from '../lib/config'
import { store } from '../lib/store'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.get('access_token')}`,
  }
}

function getBaseURL() {
  return `${config.lcApiUrl}/v3.3/configuration/action`
}

export const ConfigurationApiService = {
  async listWebhooks({ clientId }) {
    const data = await fetch(`${getBaseURL()}/list_webhooks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ owner_client_id: clientId }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data
  },
  async registerWebhook({ clientId, url, action, secret }) {
    const data = await fetch(`${getBaseURL()}/register_webhook`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        url,
        action,
        type: 'license',
        secret_key: secret,
        owner_client_id: clientId,
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data
  },
  async unregisterWebhook({ id, clientId }) {
    const data = await fetch(`${getBaseURL()}/unregister_webhook`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id,
        owner_client_id: clientId,
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data
  },
}
