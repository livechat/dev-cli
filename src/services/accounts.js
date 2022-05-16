import fetch from 'node-fetch'
import { config } from '../lib/config'
import { store } from '../lib/store'

function getHeaders() {
  return {
    Authorization: `Bearer ${store.get('access_token')}`,
  }
}

function getBaseURL() {
  return `${config.accountsUrl}/v2`
}

export const AccountsService = {
  async createSSOClient({ clientName, clientType, redirectURI, configurationUri }) {
    const data = await fetch(`${getBaseURL()}/clients`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: clientName,
        type: clientType,
        visibility: 'private',
        redirect_uri: redirectURI.join(','),
        scopes: [],
        configuration_uri: configurationUri,
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  },
  async updateSSOClient({ clientId, clientType, redirectURI }) {
    const data = await fetch(`${getBaseURL()}/clients/${clientId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        type: clientType,
        redirect_uri: redirectURI.join(','),
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  },
  async updateSSOClientScopes({ clientId, scopes }) {
    const data = await fetch(`${getBaseURL()}/clients/${clientId}/scopes`, {
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      method: 'PUT',
      body: JSON.stringify(scopes),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }
  },
  async getScopes() {
    const data = await fetch(`${getBaseURL()}/scopes`).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  },
  async codeGrant({ code }) {
    const data = await fetch(`${getBaseURL()}/token`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.webServerUrl,
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  },
  async refreshToken({ token }) {
    const data = await fetch(`${getBaseURL()}/token`, {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: 'http://localhost:5555',
        refresh_token: token,
      }),
    }).then((res) => res.json())

    if (data.error) {
      throw new Error(data.error)
    }

    return data
  },
}
