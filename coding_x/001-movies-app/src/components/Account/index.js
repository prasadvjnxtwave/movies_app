import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'
import Footer from '../Footer'

import './index.css'

const Account = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const mail = localStorage.getItem('username')
  const password = localStorage.getItem('password')

  let lengthOfPassWord
  let passwordPattern

  if ((mail && password !== null) || (mail && password !== undefined)) {
    lengthOfPassWord = password.length
    passwordPattern = '*'.repeat(lengthOfPassWord)
  }

  return (
    <div className="account-container">
      <Header />
      <div className="account-information-container">
        <h1 className="account-heading">Account</h1>
        <hr className="line-element" />
        <div className="membership-container">
          <p className="membership-heading">Member ship</p>
          <div className="membership-details-container">
            <p className="membership-username">{mail}</p>
            <p className="membership-password">Password : {passwordPattern}</p>
          </div>
        </div>
        <hr className="line-element" />
        <div className="plan-container">
          <p className="membership-heading">Plan details</p>
          <div className="plan-details-container">
            <p className="plan-paragraph">Premium</p>
            <p className="plan-details">Ultra HD</p>
          </div>
        </div>
        <hr className="line-element" />
        <div className="logout-button-container">
          <button
            onClick={onClickLogout}
            type="button"
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default withRouter(Account)
