import prompts from 'prompts'

export async function getTextPrompt(message = '') {
  const { value } = await prompts({
    message,
    type: 'text',
    name: 'value',
  })

  return value
}
