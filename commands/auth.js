import fetch from 'node-fetch'
import signale from 'signale'
import { store } from '../lib/store.js'
import { loader } from '../lib/loader.js'
import { config } from '../lib/config.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getScopesPrompt } from '../prompts/scopes.js'
import { getClientTypePrompt } from '../prompts/client-type.js'
import { getURLPrompt } from '../prompts/url.js'
import { fetchApp } from '../lib/fetch-app.js'

export async function auth(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const scopes = options.scopes ?? (await getScopesPrompt())
  const clientType = options.clientType ?? (await getClientTypePrompt())
  const redirectURI = options.redirectURI ?? (await getURLPrompt('redirect URI'))

  if (!appId || !clientType || !scopes || !redirectURI) {
    signale.error('required data not provided')
    return
  }

  try {
    loader.start('setting up app authorization')

    const app = await fetchApp(appId)
    const { client_id, secret, error } = await fetch(`${config.accountsUrl}/v2/clients`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        type: clientType,
        visibility: 'private',
        redirect_uri: redirectURI,
        name: app.name,
        scopes: [],
        configuration_uri: `${config.dpsApiUrl}/v2/applications/${appId}/authorization"`,
      }),
    }).then((res) => res.json())

    if (error) {
      throw new Error(error)
    }

    const { errors } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}/authorization`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        ssoClient: client_id,
      }),
    }).then((res) => res.json())

    if (errors) {
      throw new Error(errors)
    }

    const { error: scopesError } = await fetch(`${config.accountsUrl}/v2/clients/${client_id}/scopes`, {
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      method: 'PUT',
      body: JSON.stringify(scopes.map((s) => ({ scope: s, required: true }))),
    }).then((res) => res.json())

    if (scopesError) {
      throw new Error(scopesError)
    }

    loader.stop()
    signale.success('app authorization added')
    signale.info(`client_id: ${client_id}`)
    signale.info(`client_secret: ${secret}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/authorization`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
