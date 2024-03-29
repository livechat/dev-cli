import open from 'open'
import micro, { send } from 'micro'
import { config } from './config'
import { AccountsService } from '../services/accounts'

export async function obtainAuthData() {
  return new Promise((resolve, reject) => {
    const server = micro(async (req, res) => {
      const { searchParams } = new URL(`${config.webServerUrl}${req.url}`)
      if (searchParams.has('code')) {
        try {
          const data = await AccountsService.codeGrant({ code: searchParams.get('code').replace('%3A', ':') })
          server.close((error) => {
            if (error) {
              reject(error)
            } else {
              resolve(data)
            }
          })
        } catch (error) {
          server.close(() => {
            reject(error)
          })
          return
        }
      }

      send(
        res,
        200,
        `
        <html>
          <style>
            .center {
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
            }

            .column {
              display: flex;
              align-items: center;
              flex-direction: column;
            }
          </style>
          <body>
            <div class="center">
              <div class="column">
                <h3>cli authorized successfully</h3>
                <p>you can close this window</p>
              </div>
            </div>
          </body>
        </html>
      `,
      )
    })

    const url = new URL(config.accountsUrl)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('prompt', 'consent')
    url.searchParams.set('client_id', config.clientId)
    url.searchParams.set('redirect_uri', config.webServerUrl)

    server.listen(5555)
    open(url.toString())
  })
}
