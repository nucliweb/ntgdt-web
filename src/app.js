import React from 'react'
import ReactDOM from 'react-dom'

import Router from '@s-ui/react-router/lib/Router'
import match from '@s-ui/react-router/lib/match'
import browserHistory from '@s-ui/react-router/lib/browserHistory'
import routes from './routes'
import Context from './context'
import i18n from './literals'

import Perfume from 'perfume.js'
import {VirtualListPositionsProvider} from './context/VirtualListPositions'

import {unregister} from '@s-ui/bundler/registerServiceWorker'

import './styles/index.scss'

const perfume = new Perfume({
  // Metrics
  firstContentfulPaint: true,
  firstPaint: true,
  firstInputDelay: true,
  // Analytics
  googleAnalytics: {
    enable: true,
    timingVar: 'performance'
  }
})

export const MAXWIDTH_APP = 1024 // same as $maw-App css variable
export const LATERAL_PADDING_APP = 16 * 2 // same as $p-App css variable

const render = () => {
  match(
    {routes, history: browserHistory},
    (err, redirectLocation, renderProps) => {
      if (err) {
        console.error(err) // eslint-disable-line
      }
      perfume.start('render')
      ReactDOM.render(
        <Context.Provider value={{i18n}}>
          <VirtualListPositionsProvider>
            <Router {...renderProps} />
          </VirtualListPositionsProvider>
        </Context.Provider>,
        document.getElementById('⚛️')
      )
      perfume.sendTiming('render', perfume.end('render'))
    }
  )
}
render()

window.firebase.auth().onAuthStateChanged(render)

document.addEventListener('tracker:event', evt => {
  const {category, action, label} = evt.detail
  window.ga('send', 'event', category, action, label)
})

unregister()

// register({
//   first: () => window.alert('Content is cached for offline use.'),
//   renovate: () => {
//     window.alert('New content is available; please refresh.')
//     window.location.href = '/'
//   }
// })()
