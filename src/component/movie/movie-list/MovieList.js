import MovieItemList from "./MovieItemList"
import Pagination from "../../pagination/Pagination"
import "../../themes/helpers.scss"
import "../../themes/grid.scss"
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const MovieList = () => {

    const [movies, setMovies] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const history = useHistory();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/list?page=${currentPage - 1}&size=20`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw new Error(`Unable to get data: ${response.statusText}`)
        })
        .then(json => {
            setTotalPages(json.totalPages)
            setMovies(json.content)
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        })
        .catch((err) => setError(err.message))
        .finally(() => {
            setIsPending(false)
        });
    }, [currentPage])

    function setPage(page) {
        if (page > totalPages) {
            setCurrentPage(totalPages);
        }
        if (page < 0) {
            setCurrentPage(0);
        }
        setCurrentPage(page);
    }
    
    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/"+movieId);
    };

    return <div className="movie-list">
        {isPending && "Loading data..."}
        {error}
        <h2>Movie list</h2>
        <div className="grid">
            {movies && movies.map(movie => <MovieItemList onClickHandler={redirectToMovieHandler} key={movie.id} movie={movie}></MovieItemList>)}
        </div>
        <Pagination currentPage={currentPage} lastPage={totalPages}
            setPageHandler={setPage}
        ></Pagination>
    </div>
}

export default MovieList;