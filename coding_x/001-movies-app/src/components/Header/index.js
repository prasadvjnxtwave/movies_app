import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'

import MoviesSearch from '../MoviesSearch'

import './index.css'

class Header extends Component {
  renderMenuItems = () => {
    const {history} = this.props
    const {pathname} = history.location

    const isHomeActive = pathname === '/'
    const isPopularActive = pathname === '/popular'

    const homeClassName = isHomeActive ? 'nav-link active-nav-link' : 'nav-link'
    const popularClassName = isPopularActive
      ? 'nav-link active-nav-link'
      : 'nav-link'

    return (
      <ul className="nav-menu-list">
        <li className="list-item">
          <Link className={homeClassName} to="/">
            Home
          </Link>
        </li>
        <li className="list-item">
          <Link className={popularClassName} to="/popular">
            Popular
          </Link>
        </li>
      </ul>
    )
  }

  onClickAvatarButton = () => {
    const {history} = this.props
    history.push('/account')
  }

  onClickSearchButton = () => {
    const {history} = this.props
    history.push('/search')
  }

  render() {
    const {
      history,
      getMoviesWithInitialValue,
      changeSearchInput,
      searchInput,
    } = this.props
    const {pathname} = history.location

    const isAccountActive = pathname === '/account'
    const backgroundColor = isAccountActive ? 'pure-header' : ''

    return (
      <nav className={`nav-header ${backgroundColor}`}>
        <div className="nav-content">
          <Link to="/">
            <img
              className="website-logo"
              src="https://res.cloudinary.com/do4qwwms8/image/upload/v1635419613/website-logo_qwpc3c.png"
              alt="website logo"
            />
          </Link>
          {this.renderMenuItems()}
        </div>
        <div className="search-account-container">
          <MoviesSearch
            getMoviesWithInitialValue={getMoviesWithInitialValue}
            changeSearchInput={changeSearchInput}
            searchInput={searchInput}
          />
          <button
            type="button"
            className="avatar-button"
            onClick={this.onClickAvatarButton}
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/instagram-mini-project/profile/instagram-mini-project-profile-1.png"
              alt="profile"
              className="avatar-img"
            />
          </button>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)

Header.defaultProps = {
  getMoviesWithInitialValue: () => {},
  changeSearchInput: () => {},
  searchInput: '',
}
