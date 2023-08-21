import {withRouter} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './index.css'

import SimilarMovies from '../SimilarMovies'

const API_KEY = '073ee1c80c647b7c6ffb2c52eb328a6d'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SimilarMovieDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    similarMoviesData: [],
  }

  componentDidMount() {
    this.getSimilarDetailsData()
  }

  getSimilarDetailsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const pageNumber = 1
    const apiUrl = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=${pageNumber}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const similarMoviesData = await response.json()

      const filteredSimilarMoviesData = similarMoviesData.results.filter(
        eachMovie => eachMovie.poster_path !== null,
      )

      const similarMoviesList = filteredSimilarMoviesData.map(eachMovie => ({
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        similarMoviesData: similarMoviesList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
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
        onClick={this.getSimilarDetailsData}
      >
        Try Again
      </button>
    </div>
  )

  renderSimilarMovieDetailsDataView = () => {
    const {similarMoviesData} = this.state
    const smallScreenSimilarMoviesCopy = [...similarMoviesData]
    const smallScreenSimilarMovies = smallScreenSimilarMoviesCopy.splice(0, 5)

    return (
      <div className="similar-movies-container">
        <h1 className="similar-movies-heading">More like this</h1>
        <div className="similar-movies-list-container">
          {smallScreenSimilarMovies.map(eachMovieDetails => (
            <SimilarMovies
              key={eachMovieDetails.id}
              movieDetails={eachMovieDetails}
              OnClickIcon={this.onClickMovieIcon}
            />
          ))}
        </div>
      </div>
    )
  }

  renderSimilarMovies = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSimilarMovieDetailsDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderSimilarMovies()}</>
  }
}

export default withRouter(SimilarMovieDetails)
