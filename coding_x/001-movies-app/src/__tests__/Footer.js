import Cookies from 'js-cookie'
import {BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'

import {render, screen} from '@testing-library/react'

import App from '../App'

// #region

const trendingNowMoviesApiUrl = `https://apis.ccbp.in/movies-app/trending-movies`
const topRatedMoviesApiUrl = `https://apis.ccbp.in/movies-app/top-rated-movies`
const originalsApiUrl = `https://apis.ccbp.in/movies-app/originals`
const popularMoviesApiUrl = `https://apis.ccbp.in/movies-app/popular-movies`
const searchMoviesApiUrl = `https://apis.ccbp.in/movies-app/movies-search`
const movieItemDetailsApiUrl = `https://apis.ccbp.in/movies-app/movies/51b4602f-b0f2-4c81-98e0-a2a409b13926`

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

const searchMoviesResponse = {
  results: [
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/venom-let-there-be-carnage-movie-background-v0.png',
      id: '51b4602f-b0f2-4c81-98e0-a2a409b13926',
      overview:
        'After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/venom-let-there-be-carnage-movie-poster.png',
      title: 'Venom: Let There Be Carnage',
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

const popularRoutePath = '/popular'
const accountRoutePath = '/account'
const movieItemDetailsRoutePath = '/movies/51b4602f-b0f2-4c81-98e0-a2a409b13926'

const renderWithBrowserRouter = (ui, {route = '/'} = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, {wrapper: BrowserRouter})
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
  rest.get(popularMoviesApiUrl, (req, res, ctx) =>
    res(ctx.json(popularMoviesResponse)),
  ),
  rest.get(searchMoviesApiUrl, (req, res, ctx) =>
    res(ctx.json(searchMoviesResponse)),
  ),
  rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
    res(ctx.json(movieItemDetailsResponse)),
  ),
]

const server = setupServer(...handlers)

// #endregion

describe('Footer tests', () => {
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
  })
  // #endregion

  // #region - footer check all routes

  it('Home Route should consist of an HTML paragraph element in the footer with text content as "Contact us":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
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
    const paragraphEl = screen.getByText(/Contact US/i)
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('Popular Route should consist of an HTML paragraph element in the footer with text content as "Contact us":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: popularRoutePath})

    const imageEl = await screen.findByRole('img', {
      name: new RegExp(`${popularMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(imageEl).toBeInTheDocument()
    expect(imageEl.src).toBe(popularMoviesResponse.results[0].poster_path)

    const paragraphEl = screen.getByText(/Contact US/i)
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML paragraph element in the footer with text content as "Contact us":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: movieItemDetailsRoutePath})
    const headingEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()

    const paragraphEl = screen.getByText(/Contact US/i)
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  it('Account Route should consist of an HTML paragraph element in the footer with text content as "Contact us":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />, {route: accountRoutePath})
    const paragraphEl = screen.getByText(/Contact US/i)
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')
    restoreGetCookieFns()
  })

  // #endregion
})
