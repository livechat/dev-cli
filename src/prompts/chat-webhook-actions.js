import prompts from 'prompts'
import { CHAT_WEBHOOK_EVENTS } from '../lib/chat-webhooks-events'

export async function getChatWebhookActionsPrompt() {
  const { actions } = await prompts([
    {
      type: 'autocompleteMultiselect',
      name: 'actions',
      message: 'these events will trigger sending the webhook',
      choices: Object.values(CHAT_WEBHOOK_EVENTS).map((w) => ({
        value: w.name,
        title: w.name,
      })),
    },
  ])

  if (actions?.length === 0) {
    return null
  }

  return actions
}
