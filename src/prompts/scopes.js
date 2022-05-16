import prompts from 'prompts'
import signale from 'signale'
import { loader } from '../lib/loader'
import { AccountsService } from '../services/accounts'

export async function getScopesPrompt() {
  try {
    loader.start('loading scopes')
    const allScopes = await AccountsService.getScopes()
    loader.stop()

    const { scopes } = await prompts({
      name: 'scopes',
      type: 'autocompleteMultiselect',
      message: 'choose scopes',
      choices: allScopes.map((s) => ({ value: s.scope, title: s.scope })),
    })

    return scopes
  } catch (error) {
    loader.stop()
    signale.error(error.message)
  }
}
