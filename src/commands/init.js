import { exec } from 'child_process'
import signale from 'signale'
import { getTextPrompt } from '../prompts/text'
import { loader } from '../lib/loader'

export async function init(options) {
  const dirName = options.dirName || (await getTextPrompt('directory name'))

  loader.start('scaffolding new LiveChat app from template')

  try {
    await new Promise((resolve, reject) => {
      exec(`npx -y degit livechat/next-app ${dirName}`, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })

    loader.stop()

    signale.success('new app created')
    signale.info(`1. run 'cd ${dirName}'`)
    signale.info("2. run 'npm install'")
    signale.info("3. run 'lcdev login'")
    signale.info("4. run 'lcdev bootstrap'")
  } catch (error) {
    loader.stop()
    console.log(error.message)
  }
}
