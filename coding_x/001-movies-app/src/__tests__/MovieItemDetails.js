import Cookies from 'js-cookie'
import {BrowserRouter} from 'react-router-dom'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {act} from 'react-dom/test-utils'
import {format} from 'date-fns'

import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from '../App'

// #region

const movieItemDetailsApiUrl = `https://apis.ccbp.in/movies-app/movies/92c2cde7-d740-443d-8929-010b46cb0305`

const movieItemDetailsResponse = {
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

const movieItemDetailsRoutePath = '/movies/92c2cde7-d740-443d-8929-010b46cb0305'
const loginRoutePath = '/login'

const renderWithBrowserRouter = (
  ui,
  {route = movieItemDetailsRoutePath} = {},
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
  rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
    res(ctx.json(movieItemDetailsResponse)),
  ),
]

const server = setupServer(...handlers)

// #endregion

describe('Movie Item Details Route tests', () => {
  // #region

  beforeAll(() => {
    server.listen()
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

  it('When HTTP GET request in the movieItemDetails Route is successful, then the page should consist of at least two HTML list items, and the Genres List, Spoken Languages List and Similar Movies List should be rendered using a unique key as a prop to display each genre, spoken language and similar movie item respectively:::5:::', async () => {
    mockGetCookie()
    const consoleSpy = jest.spyOn(console, 'error')

    renderWithBrowserRouter(<App />)
    expect(
      await screen.findByRole('heading', {
        name: new RegExp(
          `${movieItemDetailsResponse.movie_details.title}`,
          'i',
        ),
        exact: false,
      }),
    ).toBeInTheDocument()

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

  it('When the Movie Item Details Route is opened, an HTTP GET request should be made to the Movie Item Details API URL:::10:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(movieItemDetailsResponse)
    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === movieItemDetailsApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)
    await act(() => promise1)

    expect(
      fetchSpy.mock.calls.some(
        eachCall => eachCall[0] === movieItemDetailsApiUrl,
      ),
    ).toBeTruthy()

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - Auth

  it('When "/movies/:id" is provided as the URL path by an unauthenticated user, then the page should be navigated to Login Route and should consist of an HTML button element with text content as "Login":::15:::', () => {
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

  it('When "/movies/:id" is provided as the URL path by an authenticated user, then the page should be navigated to movieItemDetails Route and should consist of an HTML main heading element with text content as the value of the key "title" from received movieItemDetails response:::15:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(window.location.pathname).toBe(movieItemDetailsRoutePath)
    restoreGetCookieFns()
  })

  // #endregion

  // #region - static UI

  it('Movie Item Details Route should consist of an HTML button element with text content as "Play":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('button', {
        name: new RegExp(/Play/, 'i'),
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "More like this":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /More like this/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "genres":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /genres/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "Audio Available":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /Audio Available/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "Rating Count":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /Rating Count/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "Rating Average":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /Rating Average/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "Budget":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /Budget/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an HTML main heading element with text content as "Release Date":::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const movieImgEl = await screen.findByRole('heading', {
      name: new RegExp(`${movieItemDetailsResponse.movie_details.title}`, 'i'),
      exact: false,
    })

    expect(movieImgEl).toBeInTheDocument()

    expect(
      await screen.findByRole('heading', {
        name: /Release Date/i,
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  // #endregion

  // #region - Loader test cases

  it('When the Movie Item Details Route is opened, an HTML container element with data-testid attribute value as "loader" should be displayed while the HTTP GET request is in progress:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)
    await waitForElementToBeRemoved(() => screen.queryAllByTestId('loader'))
    restoreGetCookieFns()
  })

  // #endregion

  // #region - success UI

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an least two HTML unordered list elements to display Genres List, Spoken Languages List and Similar Movies List received from the movieItemDetails response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    expect(
      await screen.findByRole('heading', {
        name: new RegExp(
          `${movieItemDetailsResponse.movie_details.title}`,
          'i',
        ),
        exact: false,
      }),
    ).toBeInTheDocument()

    const listEls = screen.getAllByRole('list')
    expect(listEls.length).toBeGreaterThanOrEqual(2)
    expect(listEls.every(eachEl => eachEl.tagName === 'UL')).toBeTruthy()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML main heading element with text content as the value of the key "title" from the received movieItemDetails response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    expect(
      await screen.findByRole('heading', {
        name: new RegExp(
          `${movieItemDetailsResponse.movie_details.title}`,
          'i',
        ),
        exact: false,
      }),
    ).toBeInTheDocument()

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content based on the value of the key "runtime" from the received movieItemDetails response should be converted from minutes to hours and minutes:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const noOfHours = movieItemDetailsResponse.movie_details.runtime / 60
    const noOfExactHours = Math.floor(noOfHours)
    const noOfMinutes = Math.round((noOfHours - noOfExactHours) * 60)

    const watchTime = `${noOfExactHours}h ${noOfMinutes}m`

    const paragraphEl = await screen.findByText(
      new RegExp(
        `${movieItemDetailsResponse.movie_details.runtime}|${watchTime}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content based on the value of the key "adult" from the movieItemDetails response is true then it should be displayed as A. otherwise, it should be displayed as U/A:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const sensorRating = movieItemDetailsResponse.movie_details.adult
      ? 'A'
      : 'U/A'

    const paragraphEl = await screen.findByText(
      new RegExp(`${sensorRating}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as year deriving from the value of the key "release_date" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const releasedYear = format(
      new Date(movieItemDetailsResponse.movie_details.release_date),
      'yyyy',
    )

    const paragraphEl = await screen.findByText(
      new RegExp(`^${releasedYear}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "overview" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = await screen.findByText(
      new RegExp(`^${movieItemDetailsResponse.movie_details.overview}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph elements with text content as the value of the key "name" in genres from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl1 = await screen.findByText(
      new RegExp(
        `^${movieItemDetailsResponse.movie_details.genres[0].name}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')

    const paragraphEl2 = await screen.findByText(
      new RegExp(
        `^${movieItemDetailsResponse.movie_details.genres[1].name}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')

    const paragraphEl3 = await screen.findByText(
      new RegExp(
        `^${movieItemDetailsResponse.movie_details.genres[2].name}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl3).toBeInTheDocument()
    expect(paragraphEl3.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph elements with text content as the value of the key "english_name" in spoken_languages from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl1 = await screen.findByText(
      new RegExp(
        `^${movieItemDetailsResponse.movie_details.spoken_languages[0].english_name}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl1).toBeInTheDocument()
    expect(paragraphEl1.tagName).toBe('P')

    const paragraphEl2 = await screen.findByText(
      new RegExp(
        `^${movieItemDetailsResponse.movie_details.spoken_languages[1].english_name}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl2).toBeInTheDocument()
    expect(paragraphEl2.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "vote_count" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = await screen.findByText(
      new RegExp(`${movieItemDetailsResponse.movie_details.vote_count}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "vote_average" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const paragraphEl = await screen.findByText(
      new RegExp(`${movieItemDetailsResponse.movie_details.vote_average}`, 'i'),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "budget" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const budgetInCrores = Math.floor(
      movieItemDetailsResponse.movie_details.budget / 10000000,
    )

    const paragraphEl = await screen.findByText(
      new RegExp(
        `${movieItemDetailsResponse.movie_details.budget}|${budgetInCrores} Crores`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML paragraph element with text content as the value of the key "release_date" from the received movieItemDetails response:::5:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const result = format(
      new Date(movieItemDetailsResponse.movie_details.release_date),
      'do LLLL yyyy',
    )

    const paragraphEl = await screen.findByText(
      new RegExp(
        `${movieItemDetailsResponse.movie_details.release_date}|${result}`,
        'i',
      ),
      {
        exact: false,
      },
    )
    expect(paragraphEl).toBeInTheDocument()
    expect(paragraphEl.tagName).toBe('P')

    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Movie Item Details Route is successful, then the page should consist of an HTML image elements with alt and src as the values of the keys "title" and "poster_path" respectively in "similar_movies" from the received Movie Item Details response:::10:::', async () => {
    mockGetCookie()
    renderWithBrowserRouter(<App />)

    const similarImgEl = await screen.findByRole('img', {
      name: new RegExp(
        `${movieItemDetailsResponse.movie_details.similar_movies[0].title}`,
        'i',
      ),
      exact: false,
    })

    expect(similarImgEl.src).toBe(
      movieItemDetailsResponse.movie_details.similar_movies[0].poster_path,
    )

    const similarImgEl2 = screen.getByRole('img', {
      name: new RegExp(
        `${movieItemDetailsResponse.movie_details.similar_movies[1].title}`,
        'i',
      ),
      exact: false,
    })
    expect(similarImgEl2).toBeInTheDocument()
    expect(similarImgEl2.src).toBe(
      movieItemDetailsResponse.movie_details.similar_movies[1].poster_path,
    )
    restoreGetCookieFns()
  })

  // #endregion

  // #region - failure

  it('When the HTTP GET request made to movieItemDetailsApiUrl in the Movie Item Details Route is unsuccessful, then the page should consist of an HTML image element with alt attribute value as "failure view":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
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

  it('When the HTTP GET request made to movieItemDetailsApiUrl in the Home Route is unsuccessful, then the page should consist of an HTML paragraph element with text content as "Something went wrong. Please try again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
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

  it('When the HTTP GET request made to movieItemDetailsApiUrl in the Home Route is unsuccessful, then the page should consist of an HTML button element with text content as "Try Again":::5:::', async () => {
    mockGetCookie()
    server.use(
      rest.get(movieItemDetailsApiUrl, (req, res, ctx) =>
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

  it('When the HTTP GET request made to movieItemDetailsApiUrl in the Home Route is unsuccessful and the "Try Again" button is clicked, then an HTTP GET request should be made to Movie Item Details API URL:::10:::', async () => {
    mockGetCookie()

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === movieItemDetailsApiUrl) {
        return {
          ok: false,
          json: () => Promise.resolve({}),
        }
      }
      return null
    })
    renderWithBrowserRouter(<App />)

    const buttonEl = await screen.findByRole('button', {
      name: /Try Again/i,
      exact: false,
    })
    expect(buttonEl).toBeInTheDocument()
    userEvent.click(buttonEl)
    expect(fetchSpy.mock.calls[1][0]).toBe(`${movieItemDetailsApiUrl}`)

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion
})
