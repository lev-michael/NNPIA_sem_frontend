import MovieItemList from "./MovieItemList"
import Pagination from "../../pagination/Pagination"
import "../../themes/helpers.scss"
import "../../themes/grid.scss"
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Search from "../../search/Search";
import Sort from "../../sort/Sort";

const MovieList = () => {

    const [movies, setMovies] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("id,asc");

    const history = useHistory();

    const options = [
        {id: 1, name: "Title A-Z", value: "title,asc"},
        {id: 2, name: "Title Z-A", value: "title,desc"},
        {id: 3, name: "Newest release date", value: "release_date,desc"},
        {id: 4, name: "Oldest realease date", value: "release_date,asc"},
        {id: 5, name: "Longest runtime", value: "runtime,desc"},
        {id: 6, name: "Shortest runtime", value: "runtime,asc"},
    ]

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/list?page=${currentPage - 1}&size=20&sort=${sort}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: searchedText ? JSON.stringify({ query: searchedText }) : null
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

    function setPage(page) {
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

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/list?page=${currentPage - 1}&size=20`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ searchedText: searchedText })
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
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [searchedText]);

    return <div className="movie-list">
        {isPending && "Loading data..."}
        {error}
        <h2>Movie list</h2>
        <div className="flex flex--justify-center">
            <Search onChangeHandler={e => setSearchedText(e.target.value)}></Search>
            <Sort options={options} selectedItemHandler={sortHandler}></Sort>            
        </div>
        <div className="grid">
            {movies && movies.map(movie => <MovieItemList onClickHandler={redirectToMovieHandler} key={movie.id} movie={movie}></MovieItemList>)}
        </div>
        <Pagination currentPage={currentPage} lastPage={totalPages}
            setPageHandler={setPage}
        ></Pagination>
    </div>
}

export default MovieList;