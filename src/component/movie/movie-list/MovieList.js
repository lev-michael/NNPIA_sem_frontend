
import "../../themes/helpers.scss"
import "../../themes/grid.scss"
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import List from "../../list/List";

const MovieList = () => {

    const [movies, setMovies] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("title,asc");

    const history = useHistory();

    const options = [
        { id: 1, name: "Title A-Z", value: "title,asc" },
        { id: 2, name: "Title Z-A", value: "title,desc" },
        { id: 3, name: "Newest release date", value: "release_date,desc" },
        { id: 4, name: "Oldest realease date", value: "release_date,asc" },
        { id: 5, name: "Longest runtime", value: "runtime,desc" },
        { id: 6, name: "Shortest runtime", value: "runtime,asc" },
        { id: 7, name: "Best score", value: "avgScore,desc" },
        { id: 8, name: "Worst score", value: "avgScore,asc" },
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
        console.log(value);
        setSort(value)
    }

    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/" + movieId);
    };

    return <div className="movie-detail">
        {isPending && "Loading data..."}
        {error}
        <h2>Movie list</h2>
        <List data={movies} currentPage={currentPage} totalPages={totalPages} setPage={setPage}
            sortOptions={options} sortHandler={sortHandler} redirectToItem={redirectToMovieHandler}
            searchHandler={searchHandler}></List>
    </div>
}

export default MovieList;