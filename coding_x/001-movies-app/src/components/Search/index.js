import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import MovieItem from '../MovieItem'
import Header from '../Header'
import endpoints from '../endpoints'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    searchedMoviesData: [],
  }

  getMoviesWithInitialValue = () => {
    this.getMovies()
  }

  getMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput} = this.state
    const searchedMoviesUrl = `${endpoints.searchMoviesApi}?search=${searchInput}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(searchedMoviesUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.results.map(eachMovie => ({
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))

      const filteredSearchedMoviesData = updatedData.filter(
        eachMovie => eachMovie.posterPath !== null,
      )

      this.setState({
        searchedMoviesData: filteredSearchedMoviesData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  // #region - Pagination

  getInitialValue = () => {
    this.setState({
      activePage: 1,
    })
  }

  goToPreviousPage = () => {
    const {activePage} = this.state

    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getMovies,
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
        this.getMovies,
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

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderNoMoviesView = () => {
    const {searchInput} = this.state

    return (
      <div className="not-found-search-container">
        <img
          alt="no movies"
          className="not-found-search-image"
          src="https://res.cloudinary.com/do4qwwms8/image/upload/v1635502157/no-movies-view_kg7qpp.png"
        />
        <p className="not-found-search-paragraph">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    )
  }

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
      <button type="button" className="retry-button" onClick={this.getMovies}>
        Try Again
      </button>
    </div>
  )

  renderSearchedMoviesDataView = () => {
    const {searchedMoviesData} = this.state

    return searchedMoviesData.length === 0 ? (
      this.renderNoMoviesView()
    ) : (
      <>
        <ul className="search-movies-container">
          {searchedMoviesData.map(eachMovie => (
            <MovieItem movieDetails={eachMovie} key={eachMovie.id} />
          ))}
        </ul>
      </>
    )
  }

  renderSearchData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchedMoviesDataView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="home-search-container">
        <Header
          getMoviesWithInitialValue={this.getMoviesWithInitialValue}
          changeSearchInput={this.changeSearchInput}
          searchInput={searchInput}
        />
        {this.renderSearchData()}
      </div>
    )
  }
}

export default Search
