import signale from 'signale'
import { loader } from '../lib/loader.js'
import { getURLPrompt } from '../prompts/url.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getChatActionPrompt } from '../prompts/chat-action.js'
import { getTextPrompt } from '../prompts/text.js'
import { DevPlatformService } from '../services/dev-platform.js'

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
    const { elements } = await DevPlatformService.getApp({ appId })
    const button = elements.buttons?.find((b) => b.action === action)

    const { buttonId } = await DevPlatformService.upsertChatAction({
      appId,
      url,
      label,
      action,
      ...(button && { buttonId: button.id }),
    })

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
