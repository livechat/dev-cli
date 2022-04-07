import fetch from 'node-fetch'
import { config } from '../lib/config.js'

export async function rfreshToken(refreshToken) {
  const data = await fetch('https://accounts.labs.livechat.com/v2/token', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: 'http://localhost:5555',
      refresh_token: refreshToken,
    }),
  }).then((res) => res.json())

  return data
}
