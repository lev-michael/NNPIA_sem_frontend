import { useParams } from "react-router-dom";
import { useLayoutEffect, useState, useEffect } from "react";
import moment from "moment"
import alterPersonImage from "../../../img/person.jpg"
import alterMovieImage from "../../../img/poster.jpg"
import "./MovieDetail.scss"
import ReactStars from 'react-stars'
import Scroller from "../../scroller/Scoller";
import { useAuth } from "../../AuthContext";
import { useHistory } from "react-router-dom";
import TextShowMore from "../../text-show-more/TextShowMore";
import Loader from "../../loader/Loader";
import ProgressCircle from "../../progress-circle/ProgressCircle";


const MovieDetail = (() => {
    const { user, userDetail } = useAuth()
    const { id } = useParams();
    const [movie, setMovie] = useState();
    const [userRating, setUserRating] = useState(0);
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [watchlist, setWatchlist] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const history = useHistory();


    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}`)
            .then((res) => res.json())
            .then((movie) => {
                setMovie(movie.result);
                setError(null)
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
                setRefresh(false)
            });
    }, [id, refresh]);

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
                .then(([res1, res2]) => {
                    if (res1.ok && res2.ok) {
                        return Promise.all([res1.json(), res2.json()])
                    }
                })
                .then(([watchlist, rating]) => {
                    setError(null)
                    setWatchlist(watchlist.result);
                    setUserRating(rating.result)
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
    const redirectToEdit = () => {
        history.push("/movie/edit/" + id);
    };

    const addActor = (data) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/cast/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data, movie_id: id })
        })
        .then(_ => setRefresh(true))
        .catch(err => setError(err))
        .finally(setIsPending(false));
    }
    const addCrew = (data) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/crew/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data, movie_id: id })
        })
        .then(_ => setRefresh(true))
        .catch(err => setError(err))
        .finally(setIsPending(false));
    }


    return <div className="movie-detail">
        {isPending && <Loader />}
        {error}
        {movie && (<div>
            <div className="flex flex--align-start">
                <img style={{ borderRadius: "0.5rem" }} src={movie.img ? "http://image.tmdb.org/t/p/w300/" + movie.img : alterMovieImage} alt={movie.title}></img>
                <div className="flex--full-width margin-element--left-large">
                    <div className="flex flex--align-center margin-element--bottom-large">
                        <h1>{movie.title}</h1>
                        <div className="margin-element">
                            <ProgressCircle score={movie.avgScore} />
                        </div>
                    </div>
                    <div>Realease: {moment(movie.release_date).format("DD. MM. YYYY")}</div>
                    <div>Runtime: {movie.runtime} min</div>
                    {movie.genres && <div>Genres: {movie.genres.map((g, i) => <span key={i}>{g} {i !== movie.genres.length - 1 ? ',' : ''}</span>)}</div>}
                    <div className="flex margin-element--vertical">
                        {user && watchlist && !watchlist.includes(movie.id) && <button className="button button--red" onClick={addToWatchlist}>&hearts; Add to watchlist</button>}
                        {user && watchlist && watchlist.includes(movie.id) && <button className="button button--red" onClick={removeFromWatchlist}>&hearts; Remove from watchlist</button>}
                    </div>
                    {user && <div className="flex flex--align-center margin-element--bottom-large">
                        <span className="margin-element--right-small">Your rating: </span>
                        <ReactStars count={5} color2={"#ff0000"} size={30} value={userRating / 2} onChange={rateMovieHandler}></ReactStars>
                    </div>}
                    <div className="margin-element--top-large">About:
                        <TextShowMore text={movie.description}></TextShowMore>
                    </div>
                </div>
                <div><button className="button button--red" onClick={redirectToEdit}>Edit</button></div>
            </div>
            {movie.actors && movie.actors.length > 0 && <h3 className="margin-element--top-large margin-element--left">Actors</h3>}
            {movie.actors && <Scroller addActorHandler={addActor}  data={movie.actors} alterImage={alterPersonImage} redirectHandler={e => redirectToActorHandler(e)}></Scroller>}
            {movie.crew && movie.crew.length > 0 && <h3 className="margin-element--top-large margin-element--left">Crew</h3>}
            {movie.crew && <Scroller addCrewHandler={addCrew} data={movie.crew} alterImage={alterPersonImage} redirectHandler={redirectToActorHandler}></Scroller>}
        </div>)
        }
    </div >
})

export default MovieDetail;