import signale from 'signale'
import prompts from 'prompts'
import { loader } from '../lib/loader'
import { store } from '../lib/store'
import { obtainAuthData } from '../lib/obtain-auth-data'

export async function login() {
  const { ok } = await prompts({
    type: 'confirm',
    name: 'ok',
    message: 'You will be redirect to LiveChat Accounts page, proceed?',
  })

  if (!ok) {
    signale.error()
    return
  }

  try {
    loader.start()
    await store.set(await obtainAuthData())
    loader.stop()
  } catch (error) {
    signale.error(error.message)
    return
  }
  signale.success()
}
