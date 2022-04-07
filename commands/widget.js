import uuid from 'short-uuid'
import signale from 'signale'
import fetch from 'node-fetch'
import { loader } from '../lib/loader.js'
import { store } from '../lib/store.js'
import { config } from '../lib/config.js'
import { getURLPrompt } from '../prompts/url.js'
import { getAppIdPrompt } from '../prompts/app-id.js'
import { getWidgetPlacementPrompt } from '../prompts/widget-placement.js'

export async function widget(options) {
  const appId = options.appId ?? (await getAppIdPrompt())
  const placement = options.placement ?? (await getWidgetPlacementPrompt())
  const url = options.url ?? (await getURLPrompt('widget url'))

  if (!appId || !placement || !url) {
    signale.error('required data not provided')
    return
  }

  try {
    loader.start('setting up agent app widget')

    const { elements, code } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}`, {
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
    }).then((res) => res.json())

    if (code === 'APPLICATION_NOT_FOUND') {
      throw new Error(`App with id: '${appId}' does not exists`)
    }

    const widget = elements.widgets?.find((w) => w.placement === placement)
    const widgetId = widget ? widget.id : uuid.generate()
    const { errors } = await fetch(`${config.dpsApiUrl}/v2/applications/${appId}/widgets/${widgetId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${store.get('access_token')}`,
      },
      body: JSON.stringify({
        url,
        placement,
        initialState: null,
      }),
    }).then((res) => res.json())
    if (errors) {
      throw new Error(errors)
    }

    loader.stop()
    signale.success(`widget '${placement}' ${widget ? 'updated' : 'created'}`)
    signale.info(`app id: ${appId}`)
    signale.info(`widget id: ${widgetId}`)
    signale.info(`https://developers.labs.livechat.com/console/apps/${appId}/blocks/widgets/${widgetId}`)
  } catch (error) {
    loader.stop()
    signale.error(error.message)
    process.exit(1)
  }
}
