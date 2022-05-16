import signale from 'signale'
import { loader } from '../lib/loader'
import { getTextPrompt } from '../prompts/text'
import { DevPlatformService } from '../services/dev-platform'

export async function create(options) {
  const name = options.name || (await getTextPrompt('app name'))

  if (!name) {
    signale.error('name is required')
    return
  }

  try {
    loader.start(`creating app with name: '${name}'`)

    const { id } = await DevPlatformService.createApp({ name })

    loader.stop()
    signale.success(`app '${name}' created`)
    signale.info(`app id: ${id}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${id}`)
    return id
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
