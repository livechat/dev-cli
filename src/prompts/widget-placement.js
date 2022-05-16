import prompts from 'prompts'

export async function getWidgetPlacementPrompt() {
  const { placement } = await prompts({
    type: 'autocomplete',
    name: 'placement',
    message: 'widget placement',
    choices: [
      { title: 'Settings', value: 'settings' },
      { title: 'Chat Details', value: 'plugin' },
      { title: 'Full Screen', value: 'fullscreen' },
      { title: 'Message Box', value: 'messagebox' },
    ],
  })

  return placement
}
