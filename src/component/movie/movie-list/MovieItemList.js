import "./MovieList.scss"


function MovieItemList({ movie, onClickHandler }) {
    return <div className="movie">
        <div className="image-container" onClick={e => onClickHandler(movie.id)}>
            <img src={"http://image.tmdb.org/t/p/w185/" + movie.img} alt={movie.title}></img>
            <div className='overlay flex flex--justify-center'>
                {movie && movie.title}
            </div>
        </div>
    </div>
}

export default MovieItemList;