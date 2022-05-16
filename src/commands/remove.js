import signale from 'signale'
import { loader } from '../lib/loader.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { DevPlatformService } from '../services/dev-platform.js'

export async function remove(options) {
  const appId = options.appId ?? (await getAppIdPrompt())

  try {
    loader.start(`removing app with id: '${appId}'`)

    await DevPlatformService.removeApp({ appId })

    loader.stop()
    signale.success(`app '${appId}' deleted`)
  } catch (error) {
    signale.error(error.message)
  }
}
