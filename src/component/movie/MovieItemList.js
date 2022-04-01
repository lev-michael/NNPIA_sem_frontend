import "./MovieList.scss"

function MovieItemList({ movie }) {
    return <div className="movie">
        <div className="image-container">
            <img alt="alt" src={"http://image.tmdb.org/t/p/w185/" + movie.img}></img>
            <div className='overlay flex flex--justify-center'>
                {movie && movie.title}
            </div>
        </div>
    </div>
}

export default MovieItemList;