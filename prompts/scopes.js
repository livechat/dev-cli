import prompts from 'prompts'
import signale from 'signale'
import fetch from 'node-fetch'
import { config } from '../lib/config.js'
import { loader } from '../lib/loader.js'

export async function getScopesPrompt() {
  try {
    loader.start('loading scopes')
    const allScopes = await fetch(`${config.accountsUrl}/v2/scopes`).then((res) => res.json())
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
