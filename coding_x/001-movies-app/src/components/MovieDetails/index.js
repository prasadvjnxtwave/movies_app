import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {format} from 'date-fns'

import Header from '../Header'
import Footer from '../Footer'
import endpoints from '../endpoints'
import SimilarMovies from '../SimilarMovies'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieDetails extends Component {
  state = {
    movieDetailsData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieDetailsData()
  }

  getMovieDetailsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `${endpoints.getMovieItemDetailsApi}/${id}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedMovieDetails = {
        id: fetchedData.movie_details.id,
        posterPath: fetchedData.movie_details.poster_path,
        backdropPath: fetchedData.movie_details.backdrop_path,
        homepage: fetchedData.movie_details.homepage,
        title: fetchedData.movie_details.title,
        runtime: fetchedData.movie_details.runtime,
        adult: fetchedData.movie_details.adult,
        releaseDate: fetchedData.movie_details.release_date,
        overview: fetchedData.movie_details.overview,
        genres: fetchedData.movie_details.genres,
        spokenLanguages: fetchedData.movie_details.spoken_languages,
        voteCount: fetchedData.movie_details.vote_count,
        voteAverage: fetchedData.movie_details.vote_average,
        budget: fetchedData.movie_details.budget,
        similarMoviesData: this.getSimilarMoviesFetchedData(
          fetchedData.movie_details.similar_movies,
        ),
      }
      this.setState({
        movieDetailsData: updatedMovieDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getFormattedSimilarMoviesData = movie => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
  })

  getSimilarMoviesFetchedData = similarMovies => {
    const updatedSimilarJobsData = similarMovies.map(eachSimilarMovie =>
      this.getFormattedSimilarMoviesData(eachSimilarMovie),
    )
    return updatedSimilarJobsData
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
        onClick={this.getMovieDetailsData}
      >
        Try Again
      </button>
    </div>
  )

  renderMovieDetails = () => {
    const {movieDetailsData} = this.state
    const {
      releaseDate,
      genres,
      spokenLanguages,
      voteCount,
      voteAverage,
      budget,
    } = movieDetailsData

    // const budgetInCrores = Math.floor(budget / 10000000)

    // const outputBudget = crores(budgetInCrores)

    // const newDate = new Date(releaseDate)

    // const yearOfRelease = newDate.getFullYear()

    // const getMonth = newDate.getMonth()

    // const monthOfRelease = listOfMonths[getMonth]

    // const date = newDate.getDate()

    // const dateOfRelease = `${date}${nth(
    //   date,
    // )} ${monthOfRelease} ${yearOfRelease}`

    const result = format(new Date(releaseDate), 'do LLLL yyyy')

    return (
      <div className="detailed-movie-categories-container">
        <div className="genres-category">
          <h1 className="genres-heading">Genres</h1>
          <div className="genres-container">
            {genres.map(eachGenre => (
              <p key={eachGenre.id} className="category-paragraph">
                {eachGenre.name}
              </p>
            ))}
          </div>
        </div>
        <div className="audio-category">
          <h1 className="audio-heading">Audio Available</h1>
          <ul className="audio-container">
            {spokenLanguages.map(eachAudio => (
              <li className="audio-list-item" key={eachAudio.id}>
                <p className="category-paragraph">{eachAudio.english_name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rating-category">
          <h1 className="rating-heading">Rating Count</h1>
          <p className="category-paragraph">{voteCount}</p>
          <h1 className="rating-average-heading">Rating Average</h1>
          <p className="category-paragraph">{voteAverage}</p>
        </div>
        <div className="budget-category">
          <h1 className="budget-heading">Budget</h1>
          <p className="category-paragraph">{budget}</p>
          <h1 className="release-date-heading">Release Date</h1>
          <p className="category-paragraph">{result}</p>
        </div>
      </div>
    )
  }

  renderTitleDetails = () => {
    const {movieDetailsData} = this.state
    const {title, runtime, adult, releaseDate, overview} = movieDetailsData

    const noOfHours = runtime / 60
    const noOfExactHours = Math.floor(noOfHours)
    const noOfMinutes = Math.round((noOfHours - noOfExactHours) * 60)

    const watchTime = `${noOfExactHours}h ${noOfMinutes}m`

    const sensorRating = adult ? 'A' : 'U/A'

    let releasedYear

    if (releaseDate !== undefined) {
      releasedYear = releaseDate.split('-')
    }

    return (
      <div className="title-details-container">
        <h1 className="movie-title">{title}</h1>
        <div className="movie-review-container">
          <p className="watch-time">{watchTime}</p>
          <p className="sensor-rating">{sensorRating}</p>
          <p className="release-year">{releasedYear[0]}</p>
        </div>
        <p className="movie-overview">{overview}</p>
        <button type="button" className="play-button">
          Play
        </button>
      </div>
    )
  }

  renderSimilarMovieDetails = () => {
    const {movieDetailsData} = this.state
    const {similarMoviesData} = movieDetailsData

    return (
      <div className="similar-movies-container">
        <h1 className="similar-movies-heading">More like this</h1>
        <ul className="similar-movies-list-container">
          {similarMoviesData.map(eachMovieDetails => (
            <SimilarMovies
              key={eachMovieDetails.id}
              movieDetails={eachMovieDetails}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderMovieItemDetailsDataView = () => {
    const {movieDetailsData} = this.state
    const {backdropPath} = movieDetailsData

    return (
      <>
        <div
          className="medium-screen-movie-container"
          style={{
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: 'cover',
            height: '86vh',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Header />
          {this.renderTitleDetails()}
          {this.renderMovieDetails()}
          {this.renderSimilarMovieDetails()}
          <Footer />
        </div>
      </>
    )
  }

  renderMovieItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieItemDetailsDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderMovieItemDetails()}</>
  }
}

export default withRouter(MovieDetails)
