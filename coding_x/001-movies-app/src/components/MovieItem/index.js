import {Link} from 'react-router-dom'

import './index.css'

const MovieItem = props => {
  const {movieDetails} = props
  const {posterPath, title, id} = movieDetails

  return (
    <li className="movie-icon-item">
      <Link key={id} to={`/movies/${id}`} className="link-item">
        <img alt={title} className="movie-image" src={posterPath} />
      </Link>
    </li>
  )
}

export default MovieItem
