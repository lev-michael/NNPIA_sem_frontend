import { useParams } from 'react-router-dom';
import { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import "./ActorDetail.scss"
import Scroller from '../../scroller/Scoller';
import { useHistory } from 'react-router-dom';
import TextShowMore from '../../text-show-more/TextShowMore';

function ActorDetail() {
    const { id } = useParams();
    const [actor, setActor] = useState();
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();

    const history = useHistory();

    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/person/${id}`)
            .then((res) => res.json())
            .then((person) => {
                setActor(person);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
            });
    }, []);

    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/" + movieId);
    };


    return <div className='actor-detail'>
        {isPending && "Loading data..."}
        {error}
        {actor && <div className="flex flex--align-center">
            <img style={{ borderRadius: "0.5rem" }} src={"http://image.tmdb.org/t/p/w300/" + actor.img} alt={actor.name}></img>
            <div className="flex--full-width margin-element--left-large">
                <div className="flex flex--align-center margin-element--bottom-large">
                    <h1>{actor.name}</h1>
                </div>
                <p>Birthday: {moment(actor.birthday).format("DD. MM. YYYY")} (Age: {moment(moment.now()).diff(actor.birthday, 'years', false)}) </p>
                <p>Gender: {actor.gender}</p>
                <p>Biography:</p>
                <TextShowMore text={actor.biography}></TextShowMore>
                {actor.cast_movies > 1 && <p>Act in {actor.cast_movies.length} movie{actor.cast_movies.length > 1 ? "s" : ""}</p>}
                {actor.crew_movies > 1 && <p>Contribute in {actor.crew_movies.length} movie{actor.crew_movies.length > 1 ? "s" : ""}</p>}
                <p>Known for: {actor.cast_movies ? "Acting, " : ""}{Array.from(new Set(actor.crew_movies.map((item) => item.role + ", ")))}</p>
            </div>
        </div>}
        {actor && actor.crew_movies && <Scroller data={actor.crew_movies} redirectHandler={e => redirectToMovieHandler(e)}></Scroller>}
        {actor && actor.cast_movies && <Scroller data={actor.cast_movies} redirectHandler={e => redirectToMovieHandler(e)}></Scroller>}
    </div>;
}

export default ActorDetail;