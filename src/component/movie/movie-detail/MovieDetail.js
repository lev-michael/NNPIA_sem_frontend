import { useParams } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import moment from "moment"
import alterImage from "./person.jpg"
import "./MovieDetail.scss"
import ReactStars from 'react-stars'
import Scroller from "../../scroller/Scoller";
import { useAuth } from "../../AuthContext";


const MovieDetail = (() => {
    const { user } = useAuth()
    const { id } = useParams();
    const [movie, setMovie] = useState();
    const [actors, setActors] = useState();
    const [crew, setCrew] = useState();
    const [avgRating, setAvgRating] = useState(0);
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();


    useLayoutEffect(() => {
        Promise.all([
            fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}`),
            fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}/actors`),
            fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}/crew`),
            fetch(`${process.env.REACT_APP_BASE_URI}/rating/${id}`),
        ])
            .then(([res1, res2, res3, res4]) => Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]))
            .then(([movie, actors, crew, rating]) => {
                setMovie(movie);
                setActors(actors);
                setCrew(crew);
                setAvgRating(rating)
                console.log(avgRating);
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, []);

    const rateMovieHandler = (score) => {
        const body = {
            score: score*2,
            user: user.sub,
            movie: movie.id    
        }
        console.log(localStorage.getItem("tokens") );
        fetch(`${process.env.REACT_APP_BASE_URI}/rating/add`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("tokens")          
                },
                body: body
            })
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => setError(err))

    }

    return <div className="movie-detail">
        {isPending && "Loading data..."}
        {error}
        {movie && (<div>
            <div className="flex flex--align-center">
                <img style={{ borderRadius: "0.5rem" }} src={"http://image.tmdb.org/t/p/w300/" + movie.img} alt={movie.title}></img>
                <div className="flex--full-width margin-element--left-large">
                    <div className="flex flex--align-center margin-element--bottom-large">
                        <h1>{movie.title}</h1>
                        <span className="margin-element--left-small margin-element--right">({Math.round(avgRating * 10)}%)</span>
                        <ReactStars count={5} color2={"#ff0000"} size={30} edit={false} value={avgRating / 2}></ReactStars>
                    </div>
                    <div>Realease: {moment(movie.release_date).format("DD. MM. YYYY")}</div>
                    <div>Runtime: {movie.runtime} min</div>
                    <div>Genres: {movie.genres.map((g, i) => <span key={g.genre.id}>{g.genre.name} {i !== movie.genres.length - 1 ? ',' : ''}</span>)}</div>
                    {user && <div className="flex margin-element--vertical">
                        <button className="button button--red">&hearts; Add to watchlist</button>
                    </div>}
                    {user && <div className="flex flex--align-center margin-element--bottom-large">
                        <span className="margin-element--right-small">Your rating: </span>
                        <ReactStars count={5} color2={"#ff0000"} size={30} onChange={rateMovieHandler}></ReactStars>
                    </div>}
                    <div className="margin-element--top-large">About:
                        <p>{movie.description}</p>
                    </div>
                </div>
            </div>
            <h3 className="margin-element--top-large margin-element--left">Actors</h3>
            {actors && <Scroller data={actors} alterImage={alterImage}></Scroller>}
            <h3 className="margin-element--top-large margin-element--left">Crew</h3>
            {crew && <Scroller data={crew} alterImage={alterImage}></Scroller>}
        </div>)
        }
    </div >
})

export default MovieDetail;