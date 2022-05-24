import signale from 'signale'
import prompts from 'prompts'
import { loader } from '../lib/loader'
import { DevPlatformService } from '../services/dev-platform'

export async function getAppIdPrompt() {
  try {
    loader.start('loading apps')
    const apps = await DevPlatformService.getMyApps()
    loader.stop()

    if (!apps) {
      signale.warn("you don't have any apps")
      process.exit(1)
    }

    const { appId } = await prompts({
      type: 'autocomplete',
      name: 'appId',
      message: 'select the app from the list',
      choices: apps.map((app) => ({ value: app.id, title: app.name })),
    })

    return appId
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
