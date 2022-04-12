import moment from "moment";
import { useHistory } from "react-router-dom";
import ReactStars from "react-stars";
import TextShowMore from "../../text-show-more/TextShowMore";
import "./MovieListItem.scss"

const MovieListItem = ({ movie, removeHandler, ratingUpdatedHandler }) => {

    const history = useHistory();

    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/" + movieId);
    };

    return <div>
        {movie && <div className='movie-list-item flex flex--align-center'>
            <img style={{ borderRadius: "0.5rem 0 0 0.5rem" }} src={"http://image.tmdb.org/t/p/w154/" + movie.img} alt={movie.title}></img>
            <div className='padding-element--horizontal' style={{ height: "231px", position: "relative" }}>
                <div className="flex flex--align-center margin-element--top">
                    <div className="text text--bold">{movie.title}</div>
                    <span className="margin-element--left-small margin-element--right">{movie.scores && movie.scores.length > 0 ? `(${Math.round((movie.scores.map(s => s.score).reduce((score, sum) => sum += score, 0) / movie.scores.length) * 10)}%)` : ""}</span>
                    {movie.scores && movie.scores.length > 0 && <ReactStars count={5} color2={"#ff0000"} size={22} edit={false} value={((movie.scores.map(s => s.score).reduce((score, sum) => sum += score, 0) / movie.scores.length) ?? 0) / 2}></ReactStars>}
                    <span className="margin-element--left-small margin-element--right">({movie.score ? `${Math.round(movie.score * 10)}%` : "Not reviewed"})</span>
                    {movie.score && <ReactStars count={5} color2={"#ff0000"} size={22} edit={true} value={movie.score / 2} onChange={e => ratingUpdatedHandler(e, movie.id)}></ReactStars>}
                </div>
                <div className="text text--label">Release date: {moment(movie.release_date).format("DD. MM. YYYY")}, Runtime: {movie.runtime}min</div>
                <p className='text text--small'></p>
                <TextShowMore text={movie.description}></TextShowMore>
                <div className='flex flex--space-between flex--full-width margin-element--bottom'
                    style={{ position: "absolute", bottom: "0" }}>
                    <button className='button' onClick={e => redirectToMovieHandler(movie.id)}>Show detail</button>
                    {removeHandler && <button className='button button--red margin-element--right-large' onClick={e => removeHandler(movie.id)}>X Remove</button>}
                </div>
            </div>
        </div>}
    </div>
}

export default MovieListItem;