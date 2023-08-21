import Cookies from 'js-cookie'
import {BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {act} from 'react-dom/test-utils'

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const popularMoviesApiUrl = `https://apis.ccbp.in/movies-app/popular-movies`

const movieItemDetailsApiUrl = `https://apis.ccbp.in/movies-app/movies/320dee56-fdb2-40cf-8df8-92b251bd781f`

const popularMoviesResponse = {
  results: [
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/venom-movie-background-v0.png',
      id: '320dee56-fdb2-40cf-8df8-92b251bd781f',
      overview:
        'Investigative journalist Eddie Brock attempts a comeback following a scandal, but accidentally becomes the host of Venom, a violent, super powerful alien symbiote.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/venom-movie-poster.png',
      title: 'Venom',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/snake-eyes-gi-joe-origins-movie-background-v0.png',
      id: '97c8bed0-1ee7-49c3-a95f-7619ff43f7ec',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/snake-eyes-gi-joe-origins-movie-poster.png',
      title: 'Snake Eyes: G.I. Joe Origins',
    },
  ],
  total: 2,
}

const movieItemDetailsResponse = {
  movie_details: {
    adult: false,
    backdrop_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/venom-let-there-be-carnage-movie-background-v0.png',
    budget: '11 Crores',
    genres: [
      {
        id: 'af2384dc-494b-48a7-a94d-91e6b279f20b',
        name: 'Science Fiction',
      },
      {
        id: '16106068-2d4e-438f-8a9a-fa0b91e4246a',
        name: 'Action',
      },
      {
        id: '0c29016b-ff7f-4d67-8f95-f8681bc7ff1c',
        name: 'Adventure',
      },
    ],
    id: '51b4602f-b0f2-4c81-98e0-a2a409b13926',
    overview:
      'After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.',
    poster_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/venom-let-there-be-carnage-movie-poster.png',
    release_date: '2021-09-30',
    runtime: 97,
    similar_movies: [
      {
        backdrop_path:
          'https://assets.ccbp.in/frontend/react-js/movies-app/dune-movie-background-v0.png',
        id: 'c6ef2389-078a-4117-b2dd-1dee027e5e8e',
        overview:
          'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
        poster_path:
          'https://assets.ccbp.in/frontend/react-js/movies-app/dune-movie-poster.png',
        title: 'Dune',
      },
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
    ],
    spoken_languages: [
      {
        id: '4bc5f2cf-04d6-4064-bd0d-fc927fda507d',
        english_name: 'English',
      },
    ],
    title: 'Venom: Let There Be Carnage',
    vote_average: 6.8,
    vote_count: 1798,
  },
}

const loginRoutePath = '/login'
const popularRoutePath = '/popular'

const renderWithBrowserRouter = (ui, {route = '/popular'} = {}) => {
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

const handlers = [
  rest.get(popularMoviesApiUrl, (req, res, ctx) =>
    res(ctx.json(popularMoviesResponse)),
  ),
  rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
    res(ctx.json(movieItemDetailsResponse)),
  ),
]

const server = setupServer(...handlers)

// #endregion

describe('Popular Route tests', () => {
  // #region

  beforeAll(() => {
    server.listen()
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
    jest.spyOn(console, 'error').mockRestore()
    jest.spyOn(window, 'fetch').mockRestore()
  })

  // #endregion

  // #region - key error

  it('When HTTP GET request in the popular Route is successful, then the page should consist of at least two HTML list items, and the popular movies List should be rendered using a unique key as a prop to display each popular movie item respectively:::5:::', async () => {
    mockGetCookie()
    const consoleSpy = jest.spyOn(console, 'error')

    renderWithBrowserRouter(<App />)
    const imageEl = await screen.findByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()

    expect(imageEl.src).toBe(popularMoviesResponse.results[0].poster_path)

    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(2)

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/Each child in a list should have a unique/),
      expect.anything(),
      expect.anything(),
      expect.anything(),
    )

    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringMatching(/Encountered two children with the same key/),
      expect.anything(),
      expect.anything(),
    )

    consoleSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - API

  it('When the Popular Route is opened, an HTTP GET request should be made to the Popular Movies API URL:::10:::', async () => {
    mockGetCookie()

    const promise1 = Promise.resolve(popularMoviesResponse)
    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => ({
      ok: true,
      json: () => promise1,
    }))
    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    expect(fetchSpy.mock.calls[0][0]).toMatch(`${popularMoviesApiUrl}`)

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - Auth

  it('When "/popular" is provided as the URL path by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
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

  it('When "/popular" is provided as the URL path by an authenticated user, then the page should be navigated to Popular Route and should consist of an HTML image element with alt and src as the values of the keys "title" and "poster_path" respectively from the popular movies response received:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const imageEl = await screen.findByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(popularMoviesResponse.results[0].poster_path)

    expect(window.location.pathname).toBe(popularRoutePath)
    restoreGetCookieFns()
  })

  // #endregion

  // #region - Loading test cases

  it('When the Popular Route is opened, an HTML container element with data-testid attribute value as "loader" should be displayed while the HTTP GET request is in progress:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await waitForElementToBeRemoved(() => screen.queryByTestId('loader'))
    restoreGetCookieFns()
  })

  // #endregion

  // #region - success UI

  it('When the HTTP GET request in the Popular Route is successful, then the page should consist of an HTML unordered list element to display the popular movies List received from the popular movies response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const popularImgEl = await screen.findByRole('link', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(popularImgEl).toBeInTheDocument()

    const listEls = screen.getAllByRole('list')
    expect(listEls.length).toBeGreaterThanOrEqual(1)
    expect(listEls.every(eachEl => eachEl.tagName === 'UL')).toBeTruthy()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Popular Route is successful, then the page should consist of HTML image elements wrapped with Link from react-router-dom:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const popularImgEl = await screen.findByRole('link', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(popularImgEl).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Popular Route is successful, then the page should consist of HTML image elements with alt and src as the values of the keys "title" and "poster_path" respectively from the popular movies response received:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const popularImgEl = await screen.findByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(popularImgEl).toBeInTheDocument()
    expect(popularImgEl.src).toBe(popularMoviesResponse.results[0].poster_path)

    const popularImgEl2 = screen.getByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[1].title}`, 'i'),
      exact: false,
    })
    expect(popularImgEl2).toBeInTheDocument()
    expect(popularImgEl2.src).toBe(popularMoviesResponse.results[1].poster_path)
    restoreGetCookieFns()
  })

  it('When the movie item is clicked in the Popular Route, then the page should be navigated to Movie Item Details Route with "/movies/:id" in the URL path:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const popularImgEl = await screen.findByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(popularImgEl).toBeInTheDocument()

    userEvent.click(popularImgEl)

    const headingEl = await screen.findByRole('heading', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()

    expect(window.location.pathname).toMatch(
      '/movies/320dee56-fdb2-40cf-8df8-92b251bd781f',
    )

    restoreGetCookieFns()
  })

  // #endregion

  // #region - Failure

  it('When the HTTP GET request made to popularMoviesApiUrl in the Popular Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(popularMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const imgEl = await screen.findByRole('img', {
      name: /failure view/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to popularMoviesApiUrl in the Popular Route is unsuccessful, then the page should consist of an HTML paragraph element with text content as "Something went wrong. Please try again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(popularMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const paragraphEl = await screen.findByText(
      new RegExp(/Something went wrong. Please try again/i),
      {
        exact: false,
      },
    )

    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to popularMoviesApiUrl in the Popular Route is unsuccessful, then the page should consist of an HTML button element with text content as "Try Again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(popularMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const buttonEl = await screen.findByRole('button', {
      name: /Try Again/i,
      exact: false,
    })

    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to popularMoviesApiUrl in the Popular Route is unsuccessful and the "Try Again" button is clicked, then an HTTP GET request should be made to Popular Movies API URL:::10:::', async () => {
    mockGetCookie()

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => ({
      ok: false,
      json: () => Promise.resolve({}),
    }))
    renderWithBrowserRouter(<App />)

    const buttonEl = await screen.findByRole('button', {
      name: /Try Again/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)

    expect(fetchSpy.mock.calls[1][0]).toBe(`${popularMoviesApiUrl}`)
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion
})
