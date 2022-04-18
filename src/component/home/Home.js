import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../loader/Loader";
import Scroller from "../scroller/Scoller";
import "./Home.scss"
import MovieListItem from '../movie/movie-list/MovieListItem'

function Home() {
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [bestMovies, setBestMovies] = useState([]);
    const [worstMovies, setWorstMovies] = useState([]);
    const [randomMovie, setRandomMovie] = useState();

    const history = useHistory();


    useEffect(() => {
        setIsPending(true)
        Promise.all([
            fetch(`${process.env.REACT_APP_BASE_URI}/rating/best`),
            fetch(`${process.env.REACT_APP_BASE_URI}/rating/worst`),
            fetch(`${process.env.REACT_APP_BASE_URI}/movie/random`),
        ])
            .then(([res1, res2, res3]) => {
                if (res1.ok && res2.ok && res3.ok)
                  return  Promise.all([res1.json(), res2.json(), res3.json()])
            })
            .then(([best, worst, random]) => {
                setBestMovies(best.result);
                setWorstMovies(worst.result);
                setRandomMovie(random.result);
                setError(null)
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, [])

    const redirectToMovieHandler = (id) => {
        history.push("/movies/" + id);
    };

    return <div>
        <h1 className="text--centered margin-element">Welcome to Movie database!</h1>
        {isPending && <Loader />}
        <div className="error">{error}</div>
        <h3>Recommended movie: </h3>
        <MovieListItem movie={randomMovie}/>
        {bestMovies && bestMovies.length > 0 && <div>
            <h3>Best movies</h3>
            <Scroller data={bestMovies} redirectHandler={redirectToMovieHandler}></Scroller>
        </div>}
        {worstMovies && worstMovies.length > 0 && <div>
            <h3>Worst movies</h3> <Scroller data={worstMovies} redirectHandler={redirectToMovieHandler}></Scroller>
        </div>}
    </div>
}

export default Home;