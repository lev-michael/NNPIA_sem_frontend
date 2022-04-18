
import "../../themes/helpers.scss"
import "../../themes/grid.scss"
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cards from "../../cards/Cards";
import { movieSortOptions } from "../../sort/Sort";
import altImage from "../../../img/poster.jpg"


const MovieCards = () => {

    const [movies, setMovies] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("release_date,desc");

    const history = useHistory();

    const options = [
        ...movieSortOptions,
        { id: 7, name: "Best average score", value: "avgScore,desc" },
        { id: 8, name: "Worst average score", value: "avgScore,asc" },
    ]

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/list?page=${currentPage - 1}&size=20&sort=${sort}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchedText ?? "" })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(json => {
                setTotalPages(json.result.totalPages)
                setMovies(json.result.content)
                setError(null)
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
    }, [currentPage, searchedText, sort])


    const searchHandler = (text) => {
        setSearchedText(text);
    }

    const setPage = (page) => {
        if (page > totalPages) {
            setCurrentPage(totalPages);
        }
        if (page < 0) {
            setCurrentPage(0);
        }
        setCurrentPage(page);
    }

    const sortHandler = (value) => {
        setSort(value)
    }

    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/" + movieId);
    };

    const redirectToAddMovieHandler = () => {
        history.push("/movie/add");
    };

    return <div className="movie-detail">
        <div className="error">{error}</div>
        <h2>Movie list</h2>
        <Cards data={movies} currentPage={currentPage} totalPages={totalPages} setPage={setPage}
            sortOptions={options} sortHandler={sortHandler} redirectToItem={redirectToMovieHandler}
            searchHandler={searchHandler} isPending={isPending} altImage={altImage}
            addNewHandler={redirectToAddMovieHandler}></Cards>
    </div>
}

export default MovieCards;