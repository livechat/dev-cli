import signale from 'signale'
import { getTextPrompt } from './text.js'

export async function getURLPrompt(message = 'url') {
  const url = await getTextPrompt(message)

  try {
    const parsedURL = new URL(url)
    if (parsedURL.protocol !== 'https:') {
      throw new Error()
    }
    return url
  } catch {
    signale.error('invalid url')
    process.exit(1)
  }
}
