import prompts from 'prompts'

export async function getChatActionPrompt() {
  const { action } = await prompts({
    type: 'autocomplete',
    name: 'action',
    message: 'type of action.',
    choices: [
      { value: 'openLink', title: 'Open link' },
      { value: 'openModal', title: 'Open modal' },
      { value: 'sendWebhook', title: 'Send webhook' },
    ],
  })

  return action
}
