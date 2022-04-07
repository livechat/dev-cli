import prompts from 'prompts'

export async function getClientTypePrompt() {
  const { clientType } = await prompts({
    name: 'clientType',
    type: 'select',
    message: 'select client type',
    choices: [
      { value: 'javascript_app', title: 'Frontend app' },
      { value: 'server_side_app', title: 'Server-side app' },
    ],
  })

  return clientType
}
