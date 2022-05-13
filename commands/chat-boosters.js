import signale from 'signale'
import { loader } from '../lib/loader.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getURLPrompt } from '../prompts/url.js'
import { getTextPrompt } from '../prompts/text.js'
import { DevPlatformService } from '../services/dev-platform.js'

export async function chatBoosters(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const url = options.url ?? (await getURLPrompt('url of an app'))
  const ctaLabel = options.ctaLabel ?? (await getTextPrompt('button label'))
  const title = options.title ?? (await getTextPrompt('chat booster title'))
  const description = options.description ?? (await getTextPrompt('chat booster description'))

  if (!appId || !title || !description || !ctaLabel || !url) {
    signale.error('required data not provided')
    return
  }

  loader.start('setting up chat boosters')

  try {
    const chatBoosterId = await DevPlatformService.upsertChatBoosters({ appId, url, title, ctaLabel, description })

    loader.stop()
    signale.success(`chat booster '${title}' created`)
    signale.info(`app id: ${appId}`)
    signale.info(`chat booster id: ${chatBoosterId}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/chat-boosters/${chatBoosterId}`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
