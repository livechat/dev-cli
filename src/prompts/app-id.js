import signale from 'signale'
import prompts from 'prompts'
import { loader } from '../lib/loader'
import { DevPlatformService } from '../services/dev-platform'

export async function getAppIdPrompt() {
  try {
    loader.start('loading apps')
    const apps = await DevPlatformService.getMyApps()
    loader.stop()

    const { appId } = await prompts({
      type: 'autocomplete',
      name: 'appId',
      message: 'select the app to which to add the widget',
      choices: apps.map((app) => ({ value: app.id, title: app.name })),
    })

    return appId
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
