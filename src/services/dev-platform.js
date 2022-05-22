import fetch from 'node-fetch'
import { store } from '../lib/store'
import { config } from '../lib/config'
import { id } from '../lib/id'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.get('access_token')}`,
  }
}

function getBaseURL(appId = '') {
  return `${config.devPlatformApiUrl}/v2/applications${appId ? `/${appId}` : ''}`
}

export const DevPlatformService = {
  async getApp({ appId }) {
    const data = await fetch(getBaseURL(appId), {
      method: 'GET',
      headers: getHeaders(),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async getMyApps() {
    const data = await fetch(`${getBaseURL()}?filter=my`, {
      method: 'GET',
      headers: getHeaders(),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async createApp({ name }) {
    const data = await fetch(getBaseURL(), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name,
        origin: 'livechat',
      }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async removeApp({ appId }) {
    const data = await fetch(getBaseURL(appId), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }
  },
  async installApp({ appId }) {
    const data = await fetch(`${getBaseURL(appId)}/install`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async updateAppWebhook({ appId, url }) {
    const data = await fetch(`${getBaseURL(appId)}/webhook`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ url }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async registerSSOClient({ appId, clientId }) {
    const data = await fetch(`${getBaseURL(appId)}/authorization`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ssoClient: clientId }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return data
  },
  async upsertChatAction({ appId, url, label, action, buttonId }) {
    const _buttonId = buttonId || id()
    const data = await fetch(`${getBaseURL(appId)}/chat-actions/${_buttonId}`, {
      method: buttonId ? 'PATCH' : 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        url,
        label,
        action,
      }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return { buttonId: _buttonId }
  },
  async upsertChatBoosters({ appId, url, title, ctaLabel, description, chatBoosterId }) {
    const _chatBoosterId = chatBoosterId || id()
    const data = await fetch(`${getBaseURL(appId)}/chat-boosters/${_chatBoosterId}`, {
      method: chatBoosterId ? 'PATCH' : 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        url,
        title,
        ctaLabel,
        description,
      }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return { chatBoosterId: _chatBoosterId }
  },
  async upsertWidget({ appId, url, placement, widgetId }) {
    const _widgetId = widgetId || id()
    const data = await fetch(`${getBaseURL(appId)}/widgets/${_widgetId}`, {
      method: widgetId ? 'PATCH' : 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        url,
        placement,
        initialState: null,
      }),
    }).then((res) => res.json())

    if (data.errors) {
      throw new Error(data.errors)
    }

    return { widgetId: _widgetId }
  },
}
