import signale from 'signale'
import { loader } from '../lib/loader'
import { getAppIdPrompt } from '../prompts/app-id'
import { DevPlatformService } from '../services/dev-platform'

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
