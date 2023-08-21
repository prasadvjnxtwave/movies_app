import {createMemoryHistory} from 'history'
import {BrowserRouter, Router} from 'react-router-dom'
import Cookies from 'js-cookie'
import {act} from 'react-dom/test-utils'

import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {setupServer} from 'msw/node'
import {rest} from 'msw'

import App from '../App'

// #region

const loginRoutePath = '/login'
const homeRoutePath = '/'

const loginSuccessResponse = {
  jwt_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwicm9sZSI6IlBSSU1FX1VTRVIiLCJpYXQiOjE2MTk2Mjg2MTN9.nZDlFsnSWArLKKeF0QbmdVfLgzUbx1BGJsqa2kc_21Y',
}

const invalidUser = {
  error_msg: 'Username is not found',
}

const loginApiUrl = `https://apis.ccbp.in/login`
const trendingNowMoviesApiUrl = `https://apis.ccbp.in/movies-app/trending-movies`
const topRatedMoviesApiUrl = `https://apis.ccbp.in/movies-app/top-rated-movies`
const originalsApiUrl = `https://apis.ccbp.in/movies-app/originals`

const trendingNowMoviesResponse = {
  results: [
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/no-time-to-die-movie-background-v0.png',
      id: '92c2cde7-d740-443d-8929-010b46cb0305',
      overview:
        'Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help. The mission to rescue a kidnapped scientist turns out to be far more treacherous than expected, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/no-time-to-die-movie-poster.png',
      title: 'No Time to Die',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/shang-chi-and-the-legend-of-the-ten-rings-movie-background-v0.png',
      id: '046084e1-a782-4086-b723-f98c5c57ebc0',
      overview:
        'Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/shang-chi-and-the-legend-of-the-ten-rings-movie-poster.png',
      title: 'Shang-Chi and the Legend of the Ten Rings',
    },
  ],
  total: 2,
}

const topRatedMoviesResponse = {
  results: [
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/ghostbusters-afterlife-british-movie-background-v0.png',
      id: 'ef6b65e0-3fbf-4ad7-ae0e-25a478648e69',
      overview:
        'Ghostbusters: Afterlife is a 2021 American supernatural comedy film directed by Jason Reitman, who co-wrote the screenplay with Gil Kenan.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/ghostbusters-afterlife-british-movie-poster.png',
      title: 'Ghostbusters: Afterlife',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/the-shawshank-redemption-movie-background-v0.png',
      id: '258761da-3623-4988-8849-fc550d210f3e',
      overview:
        'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates -- including an older prisoner named Red -- for his integrity and unquenchable sense of hope.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/the-shawshank-redemption-movie-poster.png',
      title: 'The Shawshank Redemption',
    },
  ],
  total: 2,
}

const originalsMoviesResponse = {
  results: [
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/grindhouse-movie-background-v0.png',
      id: 'efb33428-5527-44d0-a713-1aeef4d56968',
      overview:
        "Austin's hottest DJ, Jungle Julia, sets out into the night to unwind with her two friends Shanna and Arlene. Covertly tracking their moves is Stuntman Mike, a scarred rebel leering from behind the wheel of his muscle car, revving just feet away.",
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/grindhouse-movie-poster.png',
      title: 'Death Proof',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/clifford-the-big-red-dog-movie-background-v0.png',
      id: '6de4cbcc-b24c-4833-9314-280998e4a851',
      overview:
        'When his brother asks him to look after his young son, Clifford, Martin Daniels agrees, taking the boy into his home and introducing him to his future wife, Sarah. Clifford is fixated on the idea of visiting a famed theme park, and Martin, an engineer who helped build the park, makes plans to take him.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/clifford-the-big-red-dog-movie-poster.png',
      title: 'Clifford',
    },
  ],
  total: 2,
}

const handlers = [
  rest.post(loginApiUrl, (req, res, ctx) => {
    const {username, password} = JSON.parse(req.body)
    if (username === 'rahul' && password === 'rahul@2021') {
      return res(ctx.json(loginSuccessResponse))
    }
    return res(ctx.status(400, 'invalid request'), ctx.json(invalidUser))
  }),
  rest.get(trendingNowMoviesApiUrl, (req, res, ctx) =>
    res(ctx.json(trendingNowMoviesResponse)),
  ),
  rest.get(topRatedMoviesApiUrl, (req, res, ctx) =>
    res(ctx.json(topRatedMoviesResponse)),
  ),
  rest.get(originalsApiUrl, (req, res, ctx) =>
    res(ctx.json(originalsMoviesResponse)),
  ),
]

const server = setupServer(...handlers)

let historyInstance
const mockHistoryReplace = instance => {
  jest.spyOn(instance, 'replace')
}

const restoreHistoryReplace = instance => {
  instance.replace.mockRestore()
}

const mockSetCookie = () => {
  jest.spyOn(Cookies, 'set')
  Cookies.set = jest.fn()
}

const restoreSetCookieFns = () => {
  Cookies.set.mockRestore()
}

const mockGetCookie = () => {
  const mockedGetCookie = jest.fn(() => ({
    jwt_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhaHVsIiwiaWF0IjoxNjE5MDk0MjQxfQ.1i6BbQkQvtvpv72lHPNbl2JOZIB03uRcPbchYYCkL9o',
  }))
  jest.spyOn(Cookies, 'get')
  Cookies.get = mockedGetCookie
}

const restoreGetCookieFns = () => {
  Cookies.get.mockRestore()
}

const rtlRender = (ui = <App />, path = '/login') => {
  historyInstance = createMemoryHistory()
  historyInstance.push(path)
  const {container} = render(<Router history={historyInstance}>{ui}</Router>)
  return {
    history: historyInstance,
    container,
  }
}

const renderWithBrowserRouter = (ui = <App />, {route = '/login'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
}

// #endregion

describe('Movies App Authentication tests', () => {
  // #region

  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.spyOn(window, 'fetch').mockRestore()
  })

  afterAll(() => {
    server.close()
  })

  // #endregion

  // #region - Authentication

  it('When "/login" is provided as the URL path by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', async () => {
    renderWithBrowserRouter(<App />)
    const buttonEl = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(loginRoutePath)
  })

  it('When "/login" is provided as the URL path by an authenticated user, then the page should consist of HTML image elements with alt and src as the values of the keys "name" and "poster_path" respectively from the trending now movies and originals response received:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, loginRoutePath)

    const trendingImgEls = await screen.findByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(trendingImgEls).toBeInTheDocument()

    const originalImgEls = await screen.findByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls).toBeInTheDocument()

    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  // #endregion

  // #region - Login UI

  it('Login Route should consist of an HTML form element:::5:::', () => {
    const {container} = renderWithBrowserRouter(<App />)
    const formEl = container.querySelector('form')
    expect(formEl).toBeInTheDocument()
  })

  it('Login Route should consist of an HTML image element with alt attribute value as "login website logo":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const imageEl = screen.getByRole('img', {name: /login website logo/i})
    expect(imageEl).toBeInTheDocument()
  })

  it('Login Route should consist of an HTML input element with label text as "USERNAME" and type attribute value as "text":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(
      screen.getByLabelText(/USERNAME/i, {
        exact: false,
      }).type,
    ).toBe('text')
  })

  it('Login Route should consist of an HTML input element with label text as "PASSWORD" and type attribute value as "password":::5:::', () => {
    renderWithBrowserRouter(<App />)
    expect(screen.getByLabelText(/PASSWORD/i, {exact: false}).type).toBe(
      'password',
    )
  })

  it('Login Route should consist of an HTML button element with text content as "Login" and type attribute value as "submit":::5:::', () => {
    renderWithBrowserRouter(<App />)
    const buttonEl = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    expect(buttonEl.type).toBe('submit')
  })

  // #endregion

  // #region - Login Functionality

  it('When a non-empty value is provided in the HTML input element with the label text as "USERNAME", then the value provided should be displayed in the HTML input element:::10:::', () => {
    renderWithBrowserRouter(<App />)
    const inputEl = screen.getByLabelText(/USERNAME/i)
    userEvent.type(inputEl, 'rahul')
    expect(inputEl).toHaveValue('rahul')
  })

  it('When a non-empty value is provided in the HTML input element with the label text as "PASSWORD", then the value provided should be displayed in the HTML input element:::10:::', () => {
    renderWithBrowserRouter(<App />)
    const inputEl = screen.getByLabelText(/^PASSWORD/i)
    userEvent.type(inputEl, 'rahul@2021')
    expect(inputEl).toHaveValue('rahul@2021')
  })

  it('When non-empty values are provided for username and password input and the Login button is clicked, an HTTP POST request should be made to Login API URL:::5:::', async () => {
    mockSetCookie()
    const promise = Promise.resolve(loginSuccessResponse)
    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => ({
      ok: true,
      json: () => Promise.resolve(promise),
    }))
    renderWithBrowserRouter()
    const usernameField = screen.getByLabelText(/USERNAME/i)
    const passwordField = screen.getByLabelText(/PASSWORD/i)
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    await act(() => promise)
    expect(fetchSpy.mock.calls[0][0]).toMatch(`${loginApiUrl}`)

    fetchSpy.mockRestore()
    restoreSetCookieFns()
  })

  it('When non-empty values are provided for username and password input and the Login button is clicked, then an HTTP POST request should be made to Login API URL with request object containing the keys "username" and "password" with the values provided respectively:::10:::', async () => {
    mockSetCookie()

    const promise = Promise.resolve({message: 'invalid credentials'})
    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => ({
      ok: true,
      json: () => promise,
    }))
    renderWithBrowserRouter(<App />)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'test')
    userEvent.type(passwordField, 'test@2021')
    userEvent.click(loginButton)
    const {username, password} = JSON.parse(fetchSpy.mock.calls[0][1].body)
    expect(username).toBe('test')
    expect(password).toBe('test@2021')
    await act(() => promise)

    fetchSpy.mockRestore()
    restoreSetCookieFns()
  })

  it('When an invalid username and password are provided and the Login button is clicked, then the page should consist of an HTML paragraph element with text content as respective error message and the page should not be navigated:::10:::', async () => {
    const {history} = rtlRender(<App />)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    expect(history.location.pathname).toBe('/login')

    userEvent.type(usernameField, 'unknown')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    expect(
      await screen.findByText(/Username is not found/i, {
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(history.location.pathname).toBe(loginRoutePath)
  })

  it('When a valid username and password are provided and the Login button is clicked, then the Cookies.set() method should be called with three arguments - "jwt_token" string as the first argument, JWT token value as the second argument, and expiry days as the third argument:::15:::', async () => {
    mockSetCookie()
    renderWithBrowserRouter(<App />)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    await waitFor(() =>
      expect(Cookies.set).toHaveBeenCalledWith(
        'jwt_token',
        loginSuccessResponse.jwt_token,
        expect.objectContaining({expires: expect.any(Number)}),
      ),
    )
    restoreSetCookieFns()
  })

  it('When a valid username and password are provided and the Login button is clicked, then the history.replace() method should be called with the argument "/":::15:::', async () => {
    const {history} = rtlRender(<App />)
    mockHistoryReplace(history)

    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordFields = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordFields, 'rahul@2021')
    userEvent.click(loginButton)
    await waitFor(() => expect(history.replace).toHaveBeenCalledWith('/'))
    restoreHistoryReplace(history)
  })

  it('When a valid username and password are provided and the Login button is clicked, then the page should be navigated to Home Route and consist of HTML image elements with alt and src as the values of the keys "name" and "poster_path" from the trending now movies and originals responses received:::15:::', async () => {
    renderWithBrowserRouter(<App />)
    const usernameField = screen.getByLabelText(/USERNAME/i, {
      exact: false,
    })
    const passwordField = screen.getByLabelText(/PASSWORD/i, {
      exact: false,
    })
    const loginButton = screen.getByRole('button', {
      name: /Login/i,
      exact: false,
    })
    userEvent.type(usernameField, 'rahul')
    userEvent.type(passwordField, 'rahul@2021')
    userEvent.click(loginButton)
    mockGetCookie()

    const trendingImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(trendingImgEls[0]).toBeInTheDocument()

    const originalImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls[0]).toBeInTheDocument()

    const headingEl = screen.getByRole('heading', {
      name: /Trending now/i,
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  // #endregion
})
