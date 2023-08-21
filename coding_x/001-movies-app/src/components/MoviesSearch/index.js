import {withRouter} from 'react-router-dom'

import {HiOutlineSearch} from 'react-icons/hi'

import './index.css'

const MoviesSearch = props => {
  const {
    history,
    getMoviesWithInitialValue,
    changeSearchInput,
    searchInput,
  } = props

  const onSearch = () => {
    getMoviesWithInitialValue()
  }

  const onClickSearchButton = () => {
    history.push('/search')
  }

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const {pathname} = history.location

  const isSearchActive = pathname === '/search'

  return isSearchActive === true ? (
    <div className="search-container">
      <input
        value={searchInput}
        type="search"
        id="search"
        placeholder="Search"
        className="search-input-field"
        onChange={onChangeSearchInput}
      />
      <button
        data-testid="searchButton"
        onClick={onSearch}
        type="button"
        className="search-button"
      >
        <HiOutlineSearch color="#606060" size={15} />
      </button>
    </div>
  ) : (
    <button
      data-testid="searchButton"
      onClick={onClickSearchButton}
      type="button"
      className="search-empty-button"
    >
      <HiOutlineSearch color="#ffffff" size={24} />
    </button>
  )
}

export default withRouter(MoviesSearch)
