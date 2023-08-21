import Cookies from 'js-cookie'
import {BrowserRouter} from 'react-router-dom'
import {mount} from 'enzyme'
import {act} from 'react-dom/test-utils'
import {render} from '@testing-library/react'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import {HiOutlineSearch} from 'react-icons/hi'
import Slider from 'react-slick'

import App from '../App'

// #region

const trendingNowMoviesApiUrl = `https://apis.ccbp.in/movies-app/trending-movies`
const topRatedMoviesApiUrl = `https://apis.ccbp.in/movies-app/top-rated-movies`
const originalsApiUrl = `https://apis.ccbp.in/movies-app/originals`
const movieItemDetailsApiUrl = `https://apis.ccbp.in/movies-app/movies/92c2cde7-d740-443d-8929-010b46cb0305`

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
        'https://assets.ccbp.in/frontend/react-js/movies-app/the-suicide-squad-movie-background-v0.png',
      id: 'cb4abae8-4ea4-4ee0-8a4e-6ab2ecc6163d',
      overview:
        'Supervillains Harley Quinn, Bloodsport, Peacemaker and a collection of nutty cons at Belle Reve prison join the super-secret, super-shady Task Force X as they are dropped off at the remote, enemy-infused island of Corto Maltese.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/the-suicide-squad-movie-poster.png',
      title: 'The Suicide Squad',
    },
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
  total: 5,
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
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/titanic-movie-background-v0.png',
      id: '33119fe5-3966-4bba-b98c-10b241ffc9f8',
      overview:
        'Incorporating both historical and fictionalized aspects, it is based on accounts of the sinking of the RMS Titanic, and stars Leonardo DiCaprio and Kate Winslet',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/titanic-movie-poster.png',
      title: 'Titanic',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/avatar-theatrical-movie-background-v0.png',
      id: 'cfdd2370-ab67-4e0e-99f9-3014cb532a17',
      overview:
        'Avatar is a 2009 American epic science fiction film directed, written, produced, and co-edited by James Cameron and starring Sam Worthington, Zoe Saldana',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/avatar-theatrical-movie-poster.png',
      title: 'Avatar',
    },
    {
      backdrop_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/a-few-good-men-movie-background-v0.png',
      id: '09f01b09-2ae9-4a9c-aa07-7d17277b920a',
      overview:
        'When cocky military lawyer Lt. Daniel Kaffee and his co-counsel, Lt. Cmdr. JoAnne Galloway, are assigned to a murder case, they uncover a hazing ritual that could implicate high-ranking officials such as shady Col. Nathan Jessep.',
      poster_path:
        'https://assets.ccbp.in/frontend/react-js/movies-app/a-few-good-men-movie-poster.png',
      title: 'A Few Good Men',
    },
  ],
  total: 5,
}

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

// #endregion

describe('React Slick and React Icons tests', () => {
  // #region
  afterEach(() => {
    jest.spyOn(window, 'fetch').mockRestore()
  })
  // #endregion

  // #region - React Slick Test cases

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of "Slider" from "react-slick":::15:::', async () => {
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

    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    await act(() => promise1)
    await act(() => promise3)
    await wrapper.update()

    expect(wrapper.find(Slider).length).toBeGreaterThanOrEqual(2)
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of "Slider" from "react-slick" and prop "slidesToShow" value should be 4:::15:::', async () => {
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

    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    await act(() => promise1)
    await act(() => promise3)
    await wrapper.update()

    expect(wrapper.find(Slider).at(0).props().slidesToShow).toBe(4)
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of HTML image elements with alt and src as the values of the keys "name" and "poster_path" respectively from the trending now movies response received:::10:::', async () => {
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

    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    await act(() => promise1)
    await act(() => promise3)
    await wrapper.update()

    expect(
      wrapper.find('.slick-slide.slick-active').at(0).find('img').prop('src'),
    ).toEqual(`${trendingNowMoviesResponse.results[0].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(1).find('img').prop('src'),
    ).toEqual(`${trendingNowMoviesResponse.results[1].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(2).find('img').prop('src'),
    ).toEqual(`${trendingNowMoviesResponse.results[2].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(3).find('img').prop('src'),
    ).toEqual(`${trendingNowMoviesResponse.results[3].poster_path}`)

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('When the HTTP GET request in the Home Route is successful, then the page should consist of HTML image elements with alt and src as the values of the keys "name" and "poster_path" respectively from the originals response received:::10:::', async () => {
    mockGetCookie()

    const promise1 = Promise.resolve(trendingNowMoviesResponse)
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

    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    await act(() => promise1)
    await act(() => promise3)
    await wrapper.update()

    expect(
      wrapper.find('.slick-slide.slick-active').at(4).find('img').prop('src'),
    ).toEqual(`${originalsMoviesResponse.results[0].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(5).find('img').prop('src'),
    ).toEqual(`${originalsMoviesResponse.results[1].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(6).find('img').prop('src'),
    ).toEqual(`${originalsMoviesResponse.results[2].poster_path}`)
    expect(
      wrapper.find('.slick-slide.slick-active').at(7).find('img').prop('src'),
    ).toEqual(`${originalsMoviesResponse.results[3].poster_path}`)

    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  // #endregion

  // #region - React Icons Test cases

  it('Home Route should consist of an "FaGoogle" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Home page', '/')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(wrapper.find(FaGoogle)).toHaveLength(1)

    restoreGetCookieFns()
  })

  it('Popular Route should consist of an "FaGoogle" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Popular page', '/popular')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(wrapper.find(FaGoogle)).toHaveLength(1)
    restoreGetCookieFns()
  })

  it('Movie Item Details Route should consist of an "FaGoogle" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    const promise1 = Promise.resolve(movieItemDetailsResponse)
    window.history.pushState(
      {},
      'Movie Item Details page',
      movieItemDetailsRoutePath,
    )

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(url => {
      if (url === movieItemDetailsApiUrl) {
        return {
          ok: true,
          json: () => promise1,
        }
      }
      return null
    })

    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    renderWithBrowserRouter(<App />)
    await act(() => promise1)
    await wrapper.update()

    expect(wrapper.find(FaGoogle)).toHaveLength(1)
    fetchSpy.mockRestore()
    restoreGetCookieFns()
  })

  it('Account Route should consist of an "FaGoogle" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Account page', '/account')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(wrapper.find(FaGoogle)).toHaveLength(1)
    restoreGetCookieFns()
  })

  it('Home Route should consist of an "FaTwitter" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Home page', '/')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )

    expect(wrapper.find(FaTwitter)).toHaveLength(1)
  })

  it('Home Route should consist of an "FaInstagram" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Home page', '/')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
    expect(wrapper.find(FaInstagram)).toHaveLength(1)
  })

  it('Home Route should consist of an "FaYoutube" icon imported from the "react-icons/fa" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Home page', '/')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
    expect(wrapper.find(FaYoutube)).toHaveLength(1)
  })

  it('Search Route should consist of an "HiOutlineSearch" icon imported from the "react-icons/hi" package:::15:::', async () => {
    mockGetCookie()
    window.history.pushState({}, 'Search page', '/search')
    const wrapper = mount(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    )
    expect(wrapper.find(HiOutlineSearch)).toHaveLength(1)
  })

  // #endregion
})
