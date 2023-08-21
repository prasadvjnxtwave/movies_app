import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'
import Footer from '../Footer'
import MovieItem from '../MovieItem'
import endpoints from '../endpoints'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    popularMoviesData: [],
  }

  componentDidMount() {
    this.getPopularMoviesData()
  }

  getPopularMoviesData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const popularMoviesUrl = endpoints.popularMoviesApi

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(popularMoviesUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.results.map(eachMovie => ({
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))

      this.setState({
        popularMoviesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  // #region - Pagination

  goToPreviousPage = () => {
    const {activePage} = this.state

    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getPopularMoviesData,
      )
    }
  }

  goToNextPage = () => {
    const {activePage, totalPagesCount} = this.state

    if (activePage < totalPagesCount) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.getPopularMoviesData,
      )
    }
  }

  renderPageNumber = () => {
    const {activePage, totalPagesCount} = this.state

    return (
      <div className="page-numbers-container">
        <button
          data-testid="leftArrow"
          onClick={this.goToPreviousPage}
          type="button"
          className="left-button"
        >
          <img
            alt="left arrow"
            src="https://res.cloudinary.com/do4qwwms8/image/upload/v1635504144/left-icon_fkmli9.png"
            className="arrow"
          />
        </button>
        <p className="page-numbers-paragraph">
          {activePage} of {totalPagesCount}
        </p>
        <button
          data-testid="rightArrow"
          onClick={this.goToNextPage}
          type="button"
          className="right-button"
        >
          <img
            alt="right arrow"
            className="arrow"
            src="https://res.cloudinary.com/do4qwwms8/image/upload/v1635504144/right-icon_wr8tnp.png"
          />
        </button>
      </div>
    )
  }

  // #endregion

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
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
        onClick={this.getPopularMoviesData}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularMoviesDataView = () => {
    const {popularMoviesData} = this.state

    return (
      <>
        <div className="search-movies-container">
          {popularMoviesData.map(eachMovie => (
            <MovieItem movieDetails={eachMovie} key={eachMovie.id} />
          ))}
        </div>
      </>
    )
  }

  renderPopularData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularMoviesDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-search-container">
        <Header />
        {this.renderPopularData()}
        <Footer />
      </div>
    )
  }
}

export default Popular
