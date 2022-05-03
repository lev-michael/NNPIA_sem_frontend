import { useState, useLayoutEffect } from 'react';
import { useAuth } from '../AuthContext';
import Pagination from '../pagination/Pagination';
import Search from '../search/Search';
import Sort from '../sort/Sort';
import Loader from "../loader/Loader";
import "./Watchlist.scss";
import MovieListItem from '../movie/movie-list/MovieListItem';


function Watchlist() {
    const [watchlist, setWatchlist] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("title,asc");
    const [update, setUpdate] = useState(false);

    const { user, userDetail } = useAuth()    

    const options = [
        { id: 1, name: "Title A-Z", value: "title,asc" },
        { id: 2, name: "Title Z-A", value: "title,desc" },
        { id: 3, name: "Newest release date", value: "release_date,desc" },
        { id: 4, name: "Oldest realease date", value: "release_date,asc" },
        { id: 5, name: "Longest runtime", value: "runtime,desc" },
        { id: 6, name: "Shortest runtime", value: "runtime,asc" },
    ]

    useLayoutEffect(() => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/list?page=${currentPage - 1}&size=20&sort=movie.${sort}&query=${searchedText}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(watchlist => {
                setWatchlist(watchlist.result.content)
                setTotalPages(watchlist.result.totalPages)
                setError(null)
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [currentPage, sort, user, searchedText, update, userDetail.id])

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

    const removeFromWatchlist = (movieId) => {
        setIsPending(true);
        fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ userId: userDetail.id, movieId: movieId })
        })
            .then(res => {
                if (res.ok) {
                    setUpdate(true)
                    setError(null)
                }
            })
            .catch(err => setError(err))
            .finally(_ => {
                setIsPending(false)
                setUpdate(false)
            })
    }

    return <div className='actor-detail'>
        {isPending && <Loader />}
        <div className="error">{error}</div>
        <h2 className='margin-element--large'>My watchlist</h2>
        <div className="flex flex--justify-center flex--wrap">
            <Search onChangeHandler={e => searchHandler(e.target.value)}></Search>
            <Sort options={options} selectedItemHandler={sortHandler}></Sort>
        </div>
        {watchlist && watchlist.map(movie => <MovieListItem key={movie.id} movie={movie} removeHandler={removeFromWatchlist} />)}
        {!watchlist.length && <h3 className='margin-element text--centered'>There are no movies on your watchlist.</h3>}
        <Pagination currentPage={currentPage} lastPage={totalPages} setPageHandler={setPage}></Pagination>
    </div>;
}

export default Watchlist;