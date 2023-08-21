import {createMemoryHistory} from 'history'
import Cookies from 'js-cookie'
import {Router, BrowserRouter} from 'react-router-dom'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const loginRoutePath = '/login'
const AccountRoutePath = '/account'

const renderWithBrowserRouter = (ui, {route = '/account'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

const mockGetCookie = (returnToken = true) => {
  let mockedGetCookie
  if (returnToken) {
    mockedGetCookie = jest.fn(() => ({
      jwt_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
    }))
  } else {
    mockedGetCookie = jest.fn(() => undefined)
  }
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const mockRemoveCookie = () => {
  jest.spyOn(Cookies, 'remove')
  Cookies.remove = jest.fn()
}
const restoreRemoveCookieFns = () => {
  Cookies.remove.mockRestore()
}
let historyInstance
const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
}
const rtlRender = (ui = <App />, path = '/account') => {
  historyInstance = createMemoryHistory()
  historyInstance.push(path)
  render(<Router history={historyInstance}>{ui}</Router>)
  return {
    history: historyInstance,
  }
}

// #endregion

describe('Account Route tests', () => {
  // #region - Auth

  it('When "/account" is provided as the URL path by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::5:::', () => {
    mockGetCookie(false)
    renderWithBrowserRouter(<App />)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When "/account" is provided as the URL path by an authenticated user, then the page should be navigated to Account Route and should consist of an HTML main heading element with text content as "Account":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByRole('heading', {
        name: /Account/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(window.location.pathname).toBe(AccountRoutePath)
    restoreGetCookieFns()
  })

  // #endregion

  // #region - static UI

  it('Account Route should consist of an HTML main heading element with text content as "Account":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    expect(
      screen.getByRole('heading', {
        name: /Account/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element with text content as "Member ship":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = screen.getByText(new RegExp(/Member ship/, 'i'), {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element with text content as "Password":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = screen.getByText(new RegExp(/Password/, 'i'), {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element with text content as "Plan details ":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = screen.getByText(new RegExp(/Plan details/, 'i'), {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element with text content as "Premium":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = screen.getByText(new RegExp(/Premium/, 'i'), {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element with text content as "Ultra HD":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = screen.getByText(new RegExp(/Ultra HD/, 'i'), {
      exact: false,
    })
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML button element with text content as "Logout":::5:::', () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    expect(screen.getByRole('button', {name: /Logout/i})).toBeInTheDocument()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - logout functionality

  it('When the "Logout" button in the Account Route is clicked, then the Cookies.remove() method should be called with the argument as "jwt_token":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    renderWithBrowserRouter(<App />)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    userEvent.click(logoutBtn)
    expect(Cookies.remove).toHaveBeenCalledWith('jwt_token')
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  it('When the "Logout" button in the Account Route is clicked, the history.replace() method should be called with the argument as "/login":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    const {history} = rtlRender(<App />, AccountRoutePath)
    mockHistoryReplace(history)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    userEvent.click(logoutBtn)
    expect(history.replace).toHaveBeenCalledWith(loginRoutePath)
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  it('When the "Logout" button in the Account Route is clicked, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
    mockGetCookie()
    mockRemoveCookie()
    renderWithBrowserRouter(<App />)
    const logoutBtn = screen.getByRole('button', {
      name: /Logout/i,
      exact: false,
    })
    restoreGetCookieFns()
    mockGetCookie(false)
    userEvent.click(logoutBtn)
    expect(window.location.pathname).toBe(loginRoutePath)
    const buttonEl = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    restoreRemoveCookieFns()
    restoreGetCookieFns()
  })

  // #endregion
})
