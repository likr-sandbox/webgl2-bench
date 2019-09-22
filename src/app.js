import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import RootPage from './pages/root'
import RectanglesPage from './pages/rectangles'

const history = createBrowserHistory()

const App = () => {
  return (
    <Router history={history}>
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-2'>
              <div className='box'>
                <aside className='menu'>
                  <ul className='menu-list'>
                    <li>
                      <Link to='/nodes'>nodes</Link>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
            <div className='column'>
              <Switch>
                <Route path='/' component={RootPage} exact />
                <Route path='/nodes' component={RectanglesPage} exact />
              </Switch>
            </div>
          </div>
        </div>
      </section>
    </Router>
  )
}

render(<App />, document.querySelector('#content'))
