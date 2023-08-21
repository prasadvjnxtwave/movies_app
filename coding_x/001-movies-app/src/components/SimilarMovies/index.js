import './index.css'

const SimilarMovies = props => {
  const {movieDetails} = props
  const {id, title, posterPath} = movieDetails

  //   const path = `https://image.tmdb.org/t/p/original/${posterPath}`

  return (
    <li>
      <img key={id} className="image-style" alt={title} src={posterPath} />
    </li>
  )
}

export default SimilarMovies
