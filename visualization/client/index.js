import React from 'react'
import ReactDOM from 'react-dom'
import {
  Router,
  browserHistory
} from 'react-router'
import { Provider } from 'react-redux'

import rootRoutes from './rootRoutes'

ReactDOM.render(
  <Provider>
    <Router history={browserHistory} routes={rootRoutes} />
  </Provider>,
  document.getElementById('app')
)
