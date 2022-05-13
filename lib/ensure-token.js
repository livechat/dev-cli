import signale from 'signale'
import { store } from './store.js'
import { AccountsService } from '../services/accounts.js'

export async function ensureToken() {
  if (store.has('refresh_token')) {
    store.set(await AccountsService.refreshToken({ token: store.get('refresh_token') }))
  } else {
    signale.error('you need to authorize the cli first')
    process.exit(1)
  }
}
