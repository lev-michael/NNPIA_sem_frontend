import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Loader from '../loader/Loader';
import MovieListItem from '../movie/movie-list/MovieListItem';
import Pagination from '../pagination/Pagination';
import Search from '../search/Search';
import Sort, { movieSortOptions } from '../sort/Sort';
import "./MyRatings.scss"

function MyRatings() {
    const [ratings, setRatings] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState("title,asc");
    const [searchedText, setSearchedText] = useState("");
    const [update, setUpdate] = useState(false);

    const { user, userDetail } = useAuth()

    const sortOptions = [
        ...movieSortOptions,
        { id: 7, name: "Best score", value: "score,desc" },
        { id: 8, name: "Worst score", value: "score,asc" },
    ]

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/rating/my-rating?page=${currentPage - 1}&size=20&sort=${sort.includes('score') ? sort : 'movie.' + sort}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ userId: userDetail.id, query: searchedText ?? "" })
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable to get data: ${response.statusText}`)
            })
            .then(ratings => {
                setRatings(ratings.content)
                setTotalPages(ratings.totalPages)
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [currentPage, sort, searchedText, user, update])

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

    const searchHandler = (text) => {
        setSearchedText(text);
    }

    const rateMovieHandler = (score, movieId) => {
        const body = {
            score: score * 2,
            userId: userDetail.id,
            movieId: movieId
        }
        fetch(`${process.env.REACT_APP_BASE_URI}/rating/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("tokens")}`
                },
                body: JSON.stringify(body)
            })
            .then(res => {
                if (res.ok) {
                    setUpdate(true)
                    setError(null)
                }
            })
            .catch(err => setError(err))
            .finally(_ => setUpdate(false))

    }


    return <div>
        <h2>My Ratings</h2>
        <div className="flex flex--justify-center flex--wrap">
            <Search onChangeHandler={e => searchHandler(e.target.value)}></Search>
            <Sort options={sortOptions} selectedItemHandler={sortHandler}></Sort>
        </div>
        {isPending && <Loader />}
        {error}
        {ratings && ratings.map(movie => <MovieListItem key={movie.id} movie={movie} ratingUpdatedHandler={rateMovieHandler} />)}
        <Pagination currentPage={currentPage} lastPage={totalPages} setPageHandler={setPage}></Pagination>
    </div>;
}

export default MyRatings;