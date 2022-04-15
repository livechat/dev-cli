import prompts from 'prompts'
import signale from 'signale'

export async function getRedirectURI(message = 'url') {
  const { value } = await prompts({
    message,
    type: 'list',
    name: 'value',
  })

  try {
    for (const url of value) {
      const parsedURL = new URL(url)
      if (parsedURL.protocol !== 'https:') {
        throw new Error()
      }
    }
    return value
  } catch {
    signale.error('invalid url')
    process.exit(1)
  }
}
