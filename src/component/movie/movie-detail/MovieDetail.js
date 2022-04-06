import { useParams } from "react-router-dom";
import { useLayoutEffect, useState, useEffect } from "react";
import moment from "moment"
import alterPersonImage from "../../../img/person.jpg"
import "./MovieDetail.scss"
import ReactStars from 'react-stars'
import Scroller from "../../scroller/Scoller";
import { useAuth } from "../../AuthContext";
import { useHistory } from "react-router-dom";


const MovieDetail = (() => {
    const { user, userDetail } = useAuth()
    const { id } = useParams();
    const [movie, setMovie] = useState();
    const [userRating, setUserRating] = useState(0);
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [watchlist, setWatchlist] = useState([]);

    const history = useHistory();


    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}`)
            .then((res) => res.json())
            .then((movie) => {
                setMovie(movie);
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, []);

    useEffect(() => {
        if (user && userDetail && movie) {
            Promise.all([
                fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/${userDetail.id}`),
                fetch(`${process.env.REACT_APP_BASE_URI}/rating/rating`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("tokens")}`
                    },
                    body: JSON.stringify({ userId: userDetail.id, movieId: movie.id })
                }),
            ])
                .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
                .then(([watchlist, rating]) => {
                    console.log(watchlist, rating);
                    setWatchlist(watchlist);
                    setUserRating(rating)
                })
                .catch((err) => setError(err.message))
                .finally(() => {
                    setIsPending(false)
                });
        }
    }, [userDetail, movie, id, user])

    const rateMovieHandler = (score) => {
        const body = {
            score: score * 2,
            userId: userDetail.id,
            movieId: movie.id
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
            .catch(err => setError(err))
    }

    const removeFromWatchlist = () => {
        const body = {
            userId: userDetail.id,
            movieId: movie.id
        }
        fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/remove`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("tokens")}`
                },
                body: JSON.stringify(body)
            })
            .then(_ => setWatchlist(watchlist.filter(m => m.id === movie.id)))
            .catch(err => setError(err))
    }
    const addToWatchlist = () => {
        const body = {
            userId: userDetail.id,
            movieId: movie.id
        }
        fetch(`${process.env.REACT_APP_BASE_URI}/watchlist/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("tokens")}`
                },
                body: JSON.stringify(body)
            })
            .then(_ => setWatchlist([movie.id, ...watchlist]))
            .catch(err => setError(err))
    }

    const redirectToActorHandler = (personId) => {
        history.push("/actors/" + personId);
    };

    return <div className="movie-detail">
        {isPending && "Loading data..."}
        {error}
        {movie && (<div>
            <div className="flex flex--align-center">
                <img style={{ borderRadius: "0.5rem" }} src={"http://image.tmdb.org/t/p/w300/" + movie.img} alt={movie.title}></img>
                <div className="flex--full-width margin-element--left-large">
                    <div className="flex flex--align-center margin-element--bottom-large">
                        <h1>{movie.title}</h1>
                        <span className="margin-element--left-small margin-element--right">({Math.round(movie.avgRating * 10)}%)</span>
                        <ReactStars count={5} color2={"#ff0000"} size={30} edit={false} value={movie.avgRating / 2}></ReactStars>
                    </div>
                    <div>Realease: {moment(movie.release_date).format("DD. MM. YYYY")}</div>
                    <div>Runtime: {movie.runtime} min</div>
                    <div>Genres: {movie.genres.map((g, i) => <span key={i}>{g} {i !== movie.genres.length - 1 ? ',' : ''}</span>)}</div>
                    <div className="flex margin-element--vertical">
                        {user && watchlist && !watchlist.includes(movie.id) && <button className="button button--red" onClick={addToWatchlist}>&hearts; Add to watchlist</button>}
                        {user && watchlist && watchlist.includes(movie.id) && <button className="button button--red" onClick={removeFromWatchlist}>&hearts; Remove from watchlist</button>}
                    </div>
                    {user && <div className="flex flex--align-center margin-element--bottom-large">
                        <span className="margin-element--right-small">Your rating: </span>
                        <ReactStars count={5} color2={"#ff0000"} size={30} value={userRating/2} onChange={rateMovieHandler}></ReactStars>
                    </div>}
                    <div className="margin-element--top-large">About:
                        <p>{movie.description}</p>
                    </div>
                </div>
            </div>
            <h3 className="margin-element--top-large margin-element--left">Actors</h3>
            {movie.actors && <Scroller data={movie.actors} alterImage={alterPersonImage} redirectHandler={e => redirectToActorHandler(e)}></Scroller>}
            <h3 className="margin-element--top-large margin-element--left">Crew</h3>
            {movie.crew && <Scroller data={movie.crew} alterImage={alterPersonImage} redirectHandler={redirectToActorHandler}></Scroller>}
        </div>)
        }
    </div >
})

export default MovieDetail;