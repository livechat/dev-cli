import signale from 'signale'
import { store } from './store.js'
import { rfreshToken } from './refresh-token.js'

export async function ensureToken() {
  if (store.has('refresh_token')) {
    store.set(await rfreshToken(store.get('refresh_token')))
  } else {
    signale.error('you need to authorize the cli first')
    process.exit(1)
  }
}
