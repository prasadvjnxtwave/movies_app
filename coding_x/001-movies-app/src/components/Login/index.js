import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import endpoints from '../endpoints'

import './index.css'

class Login extends Component {
  state = {
    usernameInput: '',
    passwordInput: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangePassword = event => {
    this.setState({passwordInput: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="passwordInput">
          PASSWORD
        </label>
        <input
          type="password"
          id="passwordInput"
          value={password}
          onChange={this.onChangePassword}
          className="input-field"
        />
      </div>
    )
  }

  onChangeUsername = event => {
    this.setState({usernameInput: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label className="input-label" htmlFor="usernameInput">
          USERNAME
        </label>
        <input
          type="text"
          id="usernameInput"
          value={username}
          onChange={this.onChangeUsername}
          className="input-field"
        />
      </div>
    )
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    const {usernameInput, passwordInput} = this.state

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    localStorage.setItem('username', usernameInput)
    localStorage.setItem('password', passwordInput)
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {usernameInput, passwordInput} = this.state
    const userDetails = {username: usernameInput, password: passwordInput}
    const url = endpoints.loginApi
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-website-logo-container">
          <img
            src="https://res.cloudinary.com/do4qwwms8/image/upload/v1635419613/website-logo_qwpc3c.png"
            alt="login website logo"
            className="login-website-logo"
          />
        </div>
        <div className="login-form-container">
          <form className="login-form" onSubmit={this.onSubmitForm}>
            <h1 className="sign-in-heading">Login</h1>
            {this.renderUsernameField()}
            {this.renderPasswordField()}
            <button type="submit" className="login-button">
              Login
            </button>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
