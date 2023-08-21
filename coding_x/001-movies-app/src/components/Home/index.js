import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import ReactSlick from '../ReactSlick'
import Footer from '../Footer'
import Header from '../Header'
import endpoints from '../endpoints'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    randomOriginalsMovieData: {},
    trendingMoviesData: [],
    originalsData: [],
    trendingNowMoviesApiStatus: apiStatusConstants.initial,
    originalsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingNowMoviesData()
    this.getOriginalsData()
  }

  getOriginalsData = async () => {
    this.setState({
      originalsApiStatus: apiStatusConstants.inProgress,
    })
    const originalsApiUrl = endpoints.originalsApi
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(originalsApiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachResult => ({
        title: eachResult.title,
        overview: eachResult.overview,
        posterPath: eachResult.poster_path,
        backdropPath: eachResult.backdrop_path,
        id: eachResult.id,
      }))

      const randomMovieData =
        updatedData[Math.floor(Math.random() * updatedData.length)]

      this.setState({
        originalsApiStatus: apiStatusConstants.success,
        randomOriginalsMovieData: randomMovieData,
        originalsData: updatedData,
      })
    } else {
      this.setState({
        originalsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getTrendingNowMoviesData = async () => {
    this.setState({
      trendingNowMoviesApiStatus: apiStatusConstants.inProgress,
    })
    const trendingNowMoviesApiUrl = endpoints.trendingMoviesApi

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(trendingNowMoviesApiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.results.map(eachResult => ({
        posterPath: eachResult.poster_path,
        id: eachResult.id,
        title: eachResult.title,
      }))

      this.setState({
        trendingNowMoviesApiStatus: apiStatusConstants.success,
        trendingMoviesData: updatedData,
      })
    } else {
      this.setState({
        trendingNowMoviesApiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <p className="failure-view-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getOriginalsData}
      >
        Try Again
      </button>
    </div>
  )

  randomMovieDetailsView = () => {
    const {randomOriginalsMovieData} = this.state
    const {backdropPath} = randomOriginalsMovieData

    const {title, overview} = randomOriginalsMovieData

    return (
      <div
        className="home-container"
        style={{
          backgroundImage: `url(${backdropPath})`,
          backgroundSize: 'cover',
          height: '52vh',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Header />
        <div className="home-movie-details-container">
          <h1 className="home-movie-heading">{title}</h1>
          <p className="home-movie-description">{overview}</p>
          <button type="button" className="home-movie-play-button">
            Play
          </button>
        </div>
      </div>
    )
  }

  renderHomeRandomMovieData = () => {
    const {originalsApiStatus} = this.state
    switch (originalsApiStatus) {
      case apiStatusConstants.success:
        return this.randomMovieDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderHomeMovieDataView = () => {
    const {
      trendingMoviesData,
      originalsData,
      trendingNowMoviesApiStatus,
      originalsApiStatus,
    } = this.state
    return (
      <div>
        {this.renderHomeRandomMovieData()}
        <div className="home-bottom-container">
          <div>
            <h1 className="movies-list-heading">Trending Now</h1>
            <ReactSlick
              apiStatus={trendingNowMoviesApiStatus}
              moviesList={trendingMoviesData}
              retryFn={this.getTrendingNowMoviesData}
            />
          </div>
          <div>
            <h1 className="movies-list-heading">Originals</h1>
            <ReactSlick
              apiStatus={originalsApiStatus}
              moviesList={originalsData}
              retryFn={this.getOriginalsData}
            />
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  render() {
    return <>{this.renderHomeMovieDataView()}</>
  }
}

export default Home
