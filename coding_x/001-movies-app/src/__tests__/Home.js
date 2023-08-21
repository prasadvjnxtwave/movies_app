import Cookies from 'js-cookie'
import {BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {act} from 'react-dom/test-utils'

import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const trendingNowMoviesApiUrl = `https://apis.ccbp.in/movies-app/trending-movies`
const topRatedMoviesApiUrl = `https://apis.ccbp.in/movies-app/top-rated-movies`
const originalsApiUrl = `https://apis.ccbp.in/movies-app/originals`
const movieItemDetailsApiUrlTrendingNow = `https://apis.ccbp.in/movies-app/movies/92c2cde7-d740-443d-8929-010b46cb0305`
const movieItemDetailsApiUrlOriginal = `https://apis.ccbp.in/movies-app/movies/efb33428-5527-44d0-a713-1aeef4d56968`

const movieItemDetailsTrendingResponse = {
  movie_details: {
    adult: false,
    backdrop_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/no-time-to-die-movie-background-v0.png',
    budget: '24.2 Crores',
    genres: [
      {
        id: '2293435a-c4f2-4c55-a3b9-4ca6b4a8c37b',
        name: 'Adventure',
      },
      {
        id: 'ce5a5d3e-1fc7-48bd-bd6d-008f67b95f0b',
        name: 'Action',
      },
      {
        id: 'a95bda5a-7887-4f0c-bb5f-7df3f7f8e0cf',
        name: 'Thriller',
      },
    ],
    id: '92c2cde7-d740-443d-8929-010b46cb0305',
    overview:
      'Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help. The mission to rescue a kidnapped scientist turns out to be far more treacherous than expected, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.',
    poster_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/no-time-to-die-movie-poster.png',
    release_date: '2021-09-29',
    runtime: 163,
    similar_movies: [
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
        id: '25be27eb-7be1-4943-8e26-b789bd4ff253',
        english_name: 'Spanish',
      },
      {
        id: 'cb0249b5-af91-4d2c-ae80-8d27d26ded87',
        english_name: 'French',
      },
      {
        id: 'dd3233ce-c514-433f-9ad7-929fa00b093a',
        english_name: 'English',
      },
      {
        id: 'ae5ec674-71e7-475c-8d05-2889a04733f3',
        english_name: 'Italian',
      },
      {
        id: '669421c7-321b-409b-b3be-22ce8b991253',
        english_name: 'Russian',
      },
    ],
    title: 'No Time to Die',
    vote_average: 7.5,
    vote_count: 1396,
  },
}

const movieItemDetailsOriginalResponse = {
  movie_details: {
    adult: false,
    backdrop_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/grindhouse-movie-background-v0.png',
    budget: '2.5 Crores',
    genres: [
      {
        id: '9786444c-ab96-4c18-9e02-42fa29ff3a3e',
        name: 'Action',
      },
      {
        id: '648a46cf-774f-4d8d-9209-33e713c606b1',
        name: 'Thriller',
      },
    ],
    id: 'efb33428-5527-44d0-a713-1aeef4d56968',
    overview:
      "Austin's hottest DJ, Jungle Julia, sets out into the night to unwind with her two friends Shanna and Arlene. Covertly tracking their moves is Stuntman Mike, a scarred rebel leering from behind the wheel of his muscle car, revving just feet away.",
    poster_path:
      'https://assets.ccbp.in/frontend/react-js/movies-app/grindhouse-movie-poster.png',
    release_date: '2007-05-22',
    runtime: 113,
    similar_movies: [
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
    spoken_languages: [
      {
        id: '801797ad-6f00-404f-85f9-9370eb5cd261',
        english_name: 'English',
      },
    ],
    title: 'Death Proof',
    vote_average: 6.8,
    vote_count: 3853,
  },
}

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

const randomOriginalsMoviesResponse = {
  results: [
    {
      backdrop_path: '/c7k9ZZb1MoFzJeyjphKRMLHOgqU.jpg',
      id: 1991,
      overview:
        "Austin's hottest DJ, Jungle Julia, sets out into the night to unwind with her two friends Shanna and Arlene. Covertly tracking their moves is Stuntman Mike, a scarred rebel leering from behind the wheel of his muscle car, revving just feet away.",
      poster_path: '/iy6016EG1Zt44tFyxc0rATKL2hr.jpg',
      title: 'Death Proof',
    },
  ],
  total: 1,
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

const loginRoutePath = '/login'
const homeRoutePath = '/'

const renderWithBrowserRouter = (ui, {route = '/'} = {}) => {
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
  rest.get(movieItemDetailsApiUrlOriginal, (req, res, ctx) =>
    res(ctx.json(movieItemDetailsOriginalResponse)),
  ),
  rest.get(movieItemDetailsApiUrlTrendingNow, (req, res, ctx) =>
    res(ctx.json(movieItemDetailsTrendingResponse)),
  ),
]

const server = setupServer(...handlers)

// #endregion

describe('Home Route tests', () => {
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
    jest.spyOn(window, 'fetch').mockRestore()
  })

  // #endregion

  // #region - API

  it('When the Home Route is opened, an HTTP GET request should be made to the Trending Now Movies API URL:::10:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(trendingNowMoviesResponse)
    const promise2 = Promise.resolve(topRatedMoviesResponse)
    const promise3 = Promise.resolve(originalsMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise2,
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: true,
          json: () => promise3,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    await act(() => promise3)

    expect(
      fetchSpy.mock.calls.some(
        eachCall => eachCall[0] === trendingNowMoviesApiUrl,
      ),
    ).toBeTruthy()
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the Home Route is opened, an HTTP GET request should be made to the Originals API URL:::10:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(trendingNowMoviesResponse)
    const promise2 = Promise.resolve(topRatedMoviesResponse)
    const promise3 = Promise.resolve(originalsMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise2,
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: true,
          json: () => promise3,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    await act(() => promise3)

    expect(
      fetchSpy.mock.calls.some(eachCall => eachCall[0] === originalsApiUrl),
    ).toBeTruthy()

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of an HTML main heading element with text content as the value of the key "title" taken randomly from received originals response:::10:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(trendingNowMoviesResponse)
    const promise2 = Promise.resolve(topRatedMoviesResponse)
    const promise3 = Promise.resolve(randomOriginalsMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise2,
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: true,
          json: () => promise3,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    await act(() => promise3)

    const headingEls = screen.getAllByRole('heading')
    expect(
      headingEls.some(eachHeadingItem =>
        eachHeadingItem.textContent.match(
          new RegExp(`${randomOriginalsMoviesResponse.results[0].title}`, 'i'),
        ),
      ),
    ).toBeTruthy()

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of an HTML main heading element with text content as the value of the key "overview" taken randomly from received originals response:::10:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(trendingNowMoviesResponse)
    const promise2 = Promise.resolve(topRatedMoviesResponse)
    const promise3 = Promise.resolve(randomOriginalsMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve({}),
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: true,
          json: () => promise3,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    await act(() => promise3)

    const paragraphEl = screen.getByText(
      new RegExp(`${randomOriginalsMoviesResponse.results[0].overview}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - Auth

  it('When "/" is provided as the URL path by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
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

  it('When "/" is provided as the URL path by an authenticated user, then the page should be navigated to Home Route and it consist of HTML image elements with alt and src as the values of the keys "name" and "poster_path" respectively from the trending now movies and originals responses received:::15:::', async () => {
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

    expect(
      await screen.findByRole('button', {
        name: new RegExp(/Play/, 'i'),
        exact: false,
      }),
    ).toBeInTheDocument()

    expect(window.location.pathname).toBe(homeRoutePath)
    restoreGetCookieFns()
  })

  // #endregion

  // #region - static UI

  it('Home Route should consist of an HTML main heading element with text content as "Trending Now":::5:::', async () => {
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

    expect(
      screen.getByRole('heading', {
        name: /Trending Now/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Home Route should consist of an HTML main heading element with text content as "Originals":::5:::', async () => {
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

    expect(
      screen.getByRole('heading', {
        name: /Originals/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  // #endregion

  // #region - Loading

  it('When the Home Route is opened, an HTML container elements with data-testid attribute value as "loader" should be displayed while the HTTP GET request is in progress:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    expect(screen.queryAllByTestId('loader').length).toBeGreaterThanOrEqual(3)

    await waitForElementToBeRemoved(() => screen.queryAllByTestId('loader'))
    restoreGetCookieFns()
  })

  // #endregion

  // #region - success UI

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of an HTML button element with text content as "Play":::10:::', async () => {
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

    expect(
      await screen.findByRole('button', {
        name: new RegExp(/Play/, 'i'),
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the movie item in the trending now movies slider is clicked in the Home Route, then the page should be navigated to movieItemDetails Route with "/movies/:id" in the URL path:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const originalImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls[0]).toBeInTheDocument()

    const trendingImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })

    userEvent.click(trendingImgEls[0])

    await waitFor(() =>
      expect(window.location.pathname).toMatch(
        '/movies/92c2cde7-d740-443d-8929-010b46cb0305',
      ),
    )

    const headingEl = await screen.findByRole('heading', {
      name: new RegExp(
        `${movieItemDetailsTrendingResponse.movie_details.title}`,
        'i',
      ),
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the movie item in the original movies slider is clicked in the Home Route, then the page should be navigated to movieItemDetails Route with "/movies/:id" in the URL path:::10:::', async () => {
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

    userEvent.click(originalImgEls[0])

    await waitFor(() =>
      expect(window.location.pathname).toMatch(
        '/movies/efb33428-5527-44d0-a713-1aeef4d56968',
      ),
    )

    const headingEl = await screen.findByRole('heading', {
      name: new RegExp(
        `${movieItemDetailsOriginalResponse.movie_details.title}`,
        'i',
      ),
      exact: false,
    })
    expect(headingEl).toBeInTheDocument()

    restoreGetCookieFns()
  })

  // #endregion

  // #region - Failure

  it('When the HTTP GET request made to Trending Now Movies API URL in the Home Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(trendingNowMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const originalImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls[0]).toBeInTheDocument()

    const imgEl = await screen.findByRole('img', {
      name: /failure view/i,
      exact: false,
    })
    expect(imgEl).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Trending Now Movies API URL in the Home Route is unsuccessful, then the page should consist of an HTML paragraph element with text content as "Something went wrong. Please try again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(trendingNowMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const originalImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls[0]).toBeInTheDocument()

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

  it('When the HTTP GET request made to Trending Now Movies API URL in the Home Route is unsuccessful, then the page should consist of an HTML button element with text content as "Try Again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(trendingNowMoviesApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const originalImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${originalsMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(originalImgEls[0]).toBeInTheDocument()

    const buttonEl = await screen.findByRole('button', {
      name: /Try Again/i,
      exact: false,
    })

    expect(buttonEl).toBeInTheDocument()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Trending Now Movies API URL in the Home Route is unsuccessful and the "Try Again" button is clicked, then an HTTP GET request should be made to Trending Now Movies API URL:::10:::', async () => {
    mockGetCookie()

    const promise2 = Promise.resolve(topRatedMoviesResponse)
    const promise3 = Promise.resolve(originalsMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve({}),
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise2,
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: true,
          json: () => promise3,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise3)

    const buttonEl = await screen.findByRole('button', {
      name: /Try Again/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)

    const mockCallLength = fetch.mock.calls.length

    expect(fetchSpy.mock.calls[mockCallLength - 1][0]).toBe(
      `${trendingNowMoviesApiUrl}`,
    )
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Originals API URL in the Home Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(originalsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const trendingImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(trendingImgEls[0]).toBeInTheDocument()

    const imgElsFailure = await screen.findAllByRole('img', {
      name: /failure view/i,
      exact: false,
    })
    expect(imgElsFailure.length).toBeGreaterThanOrEqual(2)

    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Originals API URL in the Home Route is unsuccessful, then the page should consist of an HTML paragraph element with text content as "Something went wrong. Please try again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(originalsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const trendingImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(trendingImgEls[0]).toBeInTheDocument()

    const paragraphEl = await screen.findAllByText(
      new RegExp(/Something went wrong. Please try again/i),
      {
        exact: false,
      },
    )
    expect(paragraphEl[0]).toBeInTheDocument()
    expect(paragraphEl[0].tagName).toBe('P')

    expect(paragraphEl.length).toBeGreaterThanOrEqual(2)
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Originals API URL in the Home Route is unsuccessful, then the page should consist of an HTML button element with text content as "Try Again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(originalsApiUrl, (req, res, ctx) =>
        res(ctx.status(400), ctx.json({message: 'Something went wrong'})),
      ),
    )
    renderWithBrowserRouter(<App />)

    const trendingImgEls = await screen.findAllByRole('img', {
      name: new RegExp(`${trendingNowMoviesResponse.results[0].title}`, 'i'),
      exact: false,
    })
    expect(trendingImgEls[0]).toBeInTheDocument()

    const buttonEls = await screen.findAllByRole('button', {
      name: /Try Again/i,
      exact: false,
    })

    expect(buttonEls.length).toBeGreaterThanOrEqual(2)
    restoreGetCookieFns()
  })

  it('When the HTTP GET request made to Originals API URL in the Home Route is unsuccessful and the "Try Again" button is clicked, then an HTTP GET request should be made to Originals API URL:::10:::', async () => {
    mockGetCookie()

    const promise1 = Promise.resolve(trendingNowMoviesResponse)

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === trendingNowMoviesApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      if (url === topRatedMoviesApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve({}),
        }
      }
      if (url === originalsApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve({}),
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)

    const buttonEls = await screen.findAllByRole('button', {
      name: /Try Again/i,
      exact: false,
    })
    expect(buttonEls[0]).toBeInTheDocument()
    userEvent.click(buttonEls[0])

    const mockCallLength = fetch.mock.calls.length

    expect(fetchSpy.mock.calls[mockCallLength - 1][0]).toBe(
      `${originalsApiUrl}`,
    )

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion
})
