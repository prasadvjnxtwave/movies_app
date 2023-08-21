import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {Component} from 'react'

import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
}

class ReactSlick extends Component {
  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height="50" width="50" />
    </div>
  )

  renderFailureView = () => {
    const {retryFn} = this.props
    return (
      <div className="failure-view-container">
        <img
          alt="failure view"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          className="failure-view-img"
        />
        <p className="failure-view-heading">
          Something went wrong. Please try again
        </p>
        <button type="button" className="retry-button" onClick={retryFn}>
          Try again
        </button>
      </div>
    )
  }

  renderSlides = () => {
    const {moviesList} = this.props
    const filteredMoviesData = moviesList.filter(
      eachMovie => eachMovie.poster_path !== null,
    )

    return filteredMoviesData.map(eachMovie => {
      const {posterPath} = eachMovie

      return (
        <Link
          key={eachMovie.id}
          to={`/movies/${eachMovie.id}`}
          className="link-item"
        >
          <div className="react-slick-item">
            <img
              className="poster"
              src={posterPath}
              width="100%"
              height="100%"
              alt={eachMovie.title}
            />
          </div>
        </Link>
      )
    })
  }

  renderReactSlickData = () => {
    const {apiStatus} = this.props
    switch (apiStatus) {
      case apiStatusConstants.success:
        return <Slider {...settings}>{this.renderSlides()}</Slider>
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div className="App">{this.renderReactSlickData()}</div>
  }
}

export default ReactSlick
