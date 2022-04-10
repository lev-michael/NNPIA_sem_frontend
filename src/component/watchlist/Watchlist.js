import moment from 'moment';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactStars from 'react-stars';
import { useAuth } from '../AuthContext';
import Pagination from '../pagination/Pagination';
import Search from '../search/Search';
import Sort from '../sort/Sort';
import TextShowMore from '../text-show-more/TextShowMore';
import "./Watchlist.scss"


function Watchlist() {
    const [watchlist, setWatchlist] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchedText, setSearchedText] = useState("");
    const [sort, setSort] = useState("title,asc");

    const { user, userDetail } = useAuth()
    const history = useHistory();

    const options = [
        { id: 1, name: "Title A-Z", value: "title,asc" },
        { id: 2, name: "Title Z-A", value: "title,desc" },
        { id: 3, name: "Newest release date", value: "release_date,desc" },
        { id: 4, name: "Oldest realease date", value: "release_date,asc" },
        { id: 5, name: "Longest runtime", value: "runtime,desc" },
        { id: 6, name: "Shortest runtime", value: "runtime,asc" },
    ]


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/list?page=${currentPage - 1}&size=20&sort=movie.${sort}`, {
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
            .then(watchlist => {
                setWatchlist(watchlist.content)
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [currentPage, sort, user, searchedText])

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
            .then(response => {
                setSearchedText();
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }

    return <div>
        {isPending && "Loading data..."}
        {error}
        <h2>My watchlist</h2>
        <div className="flex flex--justify-center flex--wrap">
            <Search onChangeHandler={e => searchHandler(e.target.value)}></Search>
            <Sort options={options} selectedItemHandler={sortHandler}></Sort>
        </div>
        {watchlist && watchlist.map(movie =>
            <div key={movie.id} className='watchlist-movie flex flex--align-center'>
                <img style={{ borderRadius: "0.5rem 0 0 0.5rem" }} src={"http://image.tmdb.org/t/p/w154/" + movie.img} alt={movie.title}></img>
                <div className='flex flex--column padding-element--horizontal'>
                    <div className="flex flex--align-center">
                        <div className="text text--bold">{movie.title}</div>
                        <span className="margin-element--left-small margin-element--right">({movie.scores && movie.scores.length > 0 ? `${Math.round((movie.scores.map(s => s.score).reduce((score, sum) => sum += score, 0) / movie.scores.length) * 10)}%` : "No reviews"})</span>
                        {movie.scores && movie.scores.length > 0 && <ReactStars count={5} color2={"#ff0000"} size={22} edit={false} value={((movie.scores.map(s => s.score).reduce((score, sum) => sum += score, 0) / movie.scores.length) ?? 0) / 2}></ReactStars>}
                    </div>
                    <div className="text text--label">Release date: {moment(movie.release_date).format("DD. MM. YYYY")}, Runtime: {movie.runtime}min</div>
                    <p className='text text--small'></p>
                    <TextShowMore text={movie.description}></TextShowMore>
                    <div className='flex flex--space-between padding-element--top-large margin-element--top-large'>
                        <button className='button' onClick={e => redirectToMovieHandler(movie.id)}>Show detail</button>
                        <button className='button button--red' onClick={e => removeFromWatchlist(movie.id)}>X Remove</button>
                    </div>
                </div>
            </div>)}
        <Pagination currentPage={currentPage} lastPage={totalPages} setPageHandler={setPage}></Pagination>
    </div>;
}

export default Watchlist;