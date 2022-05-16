import signale from 'signale'
import { loader } from '../lib/loader.js'
import { config } from '../lib/config.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getScopesPrompt } from '../prompts/scopes.js'
import { getClientTypePrompt } from '../prompts/client-type.js'
import { getRedirectURI } from '../prompts/redirect-uri.js'
import { DevPlatformService } from '../services/dev-platform.js'
import { AccountsService } from '../services/accounts.js'

export async function auth(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const scopes = options.scopes ?? (await getScopesPrompt())
  const clientType = options.clientType ?? (await getClientTypePrompt())
  const redirectURI = options.redirectURI ?? (await getRedirectURI('redirect URI'))

  if (!appId || !clientType || !scopes || !redirectURI) {
    signale.error('required data not provided')
    return
  }

  try {
    loader.start('setting up app authorization')

    const app = await DevPlatformService.getApp({ appId })
    let clientSecret = null
    let clientId = app.authorization?.clientId

    if (clientId) {
      await AccountsService.updateSSOClient({ clientId, clientType, redirectURI })
    } else {
      const { client_id, secret } = await AccountsService.createSSOClient({
        clientType,
        redirectURI,
        clientName: app.name,
        configurationUri: `${config.dpsApiUrl}/v2/applications/${appId}/authorization"`,
      })
      await DevPlatformService.registerSSOClient({ appId, clientId: client_id })

      clientId = client_id
      clientSecret = secret
    }

    await AccountsService.updateSSOClientScopes({
      clientId,
      scopes: scopes.map((s) => ({ scope: s, required: true })),
    })

    loader.stop()
    if (clientSecret) {
      signale.success('app authorization added')
      signale.info(`client_id: ${clientId}`)
      signale.info(`client_secret: ${clientSecret}`)
    } else {
      signale.success('app authorization updated')
    }
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/authorization`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
