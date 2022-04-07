import signale from 'signale'
import fetch from 'node-fetch'
import { id } from '../lib/id.js'
import { loader } from '../lib/loader.js'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { getURLPrompt } from '../prompts/url.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getChatActionPrompt } from '../prompts/chat-action.js'
import { getTextPrompt } from '../prompts/text.js'

export async function chatActions(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const url = options.url ?? (await getURLPrompt('action target url'))
  const label = options.label ?? (await getTextPrompt('label for action'))
  const action = options.action ?? (await getChatActionPrompt())

  if (!appId || !action || !label || !url) {
    signale.error('required data not provided')
    return
  }

  loader.start('setting up chat actions')
  try {
    const { elements } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}`, {
      headers: { Authorization: `Bearer ${store.get('access_token')}` },
    }).then((res) => res.json())

    const button = elements.buttons?.find((b) => b.action === action)
    const buttonId = button ? button.id : id()

    const { errors } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}/chat-actions/${buttonId}`, {
      method: button ? 'PATCH' : 'PUT',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        url,
        label,
        action,
      }),
    }).then((res) => res.json())

    if (errors) {
      throw new Error(errors)
    }

    loader.stop()
    signale.success(`chat action '${action}' ${button ? 'updated' : 'created'}`)
    signale.info(`app id: ${appId}`)
    signale.info(`chat action id: ${buttonId}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/chat-actions/${buttonId}`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
