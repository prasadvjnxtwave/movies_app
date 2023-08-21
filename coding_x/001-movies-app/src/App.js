import {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'

import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Search from './components/Search'
import Popular from './components/Popular'
import MovieItemDetails from './components/MovieItemDetails'
import NotFound from './components/NotFound'
import Account from './components/Account'

import './App.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
        <ProtectedRoute exact path="/search" component={Search} />
        <ProtectedRoute exact path="/popular" component={Popular} />
        <ProtectedRoute exact path="/account" component={Account} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    )
  }
}
export default App
