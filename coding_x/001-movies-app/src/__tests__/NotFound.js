import {BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

const notFoundRoutePath = '/random-path'
const homeRoutePath = '/'

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

const renderWithBrowserRouter = (
  ui = <App />,
  {route = notFoundRoutePath} = {},
) => {
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

describe('Not Found Route tests', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('When a random path is provided as the URL path, then the page should consist of an HTML main heading element with text content as "Lost Your Way":::5:::', () => {
    renderWithBrowserRouter()
    expect(
      screen.getByRole('heading', {
        name: /Lost Your Way/i,
      }),
    ).toBeInTheDocument()
  })

  it('When a random path is provided as the URL path, then the page should consist of an HTML paragraph element with text content as "we are sorry, the page you requested could not be found Please go back to the homepage.":::5:::', () => {
    renderWithBrowserRouter()
    const paragraphEl = screen.getByText(
      /we are sorry, the page you requested could not be found Please go back to the homepage./i,
    )

    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
  })

  it('When a random path is provided as the URL path, then the page should consist of an HTML button element with text content as "Go to Home" wrapper with Link from react-router-dom:::5:::', () => {
    renderWithBrowserRouter()
    expect(
      screen.getByRole('link', {
        name: /Go to Home/i,
      }),
    ).toBeInTheDocument()
  })

  it('When a random path is provided as the URL path, then the page should consist of an HTML button element with text content as "Go to Home":::5:::', () => {
    renderWithBrowserRouter()
    expect(
      screen.getByRole('button', {
        name: /Go to Home/i,
        exact: false,
      }),
    ).toBeInTheDocument()
  })

  it('When a random path is provided as the URL path and the "Go to Home" button is clicked, then the page should be navigated to Home Route and consists of an HTML main heading element with text content as "Trending Now":::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter()
    const homeLink = screen.getByRole('link', {
      name: /Go to Home/i,
    })
    userEvent.click(homeLink)

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

    expect(
      await screen.getByRole('heading', {
        name: /Trending Now/i,
        exact: false,
      }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })
})
