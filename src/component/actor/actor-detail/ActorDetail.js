import { useParams } from 'react-router-dom';
import { useState, useLayoutEffect } from 'react';
import moment from 'moment';
import "./ActorDetail.scss"
import Scroller from '../../scroller/Scoller';
import { useHistory } from 'react-router-dom';
import TextShowMore from '../../text-show-more/TextShowMore';
import Loader from '../../loader/Loader';
import { useAuth } from '../../AuthContext';

function ActorDetail() {
    const { id } = useParams();
    const [actor, setActor] = useState();
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();
    const [refresh, setRefresh] = useState(false);
    const { userDetail } = useAuth()
    const history = useHistory();

    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/person/${id}`)
            .then((res) => res.json())
            .then((person) => {
                setActor(person.result);
                setError(null);
            })
            .catch((err) => setError(err.message))
            .finally(() => {
                setIsPending(false)
                setRefresh(false)
            });
    }, [refresh, id]);

    const redirectToMovieHandler = (movieId) => {
        history.push("/movies/" + movieId);
    };

    const addActorMovie = (data) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/cast/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data, person_id: id })
        })
            .then(_ => setRefresh(true))
            .catch(err => setError(err))
            .finally(setIsPending(false));
    }

    const addCrewMovie = (data) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/crew/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data, person_id: id })
        })
            .then(_ => setRefresh(true))
            .catch(err => setError(err))
            .finally(setIsPending(false));
    }

    const removeCast = (movie_id) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/cast/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ movie_id, person_id: id })
        })
            .then(_ => setRefresh(true))
            .catch(err => setError(err))
            .finally(setIsPending(false));
    }

    const removeCrew = (movie_id) => {
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/crew/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ movie_id, person_id: id })
        })
            .then(_ => setRefresh(true))
            .catch(err => setError(err))
            .finally(setIsPending(false));
    }

    const redirectToEdit = () => {
        history.push("/actor/edit/" + id)
    }

    return <div className='actor-detail'>
        {isPending && <Loader />}
        <div className="error">{error}</div>
        {actor && <div className="flex flex--align-start">
            <img style={{ borderRadius: "0.5rem" }} src={"http://image.tmdb.org/t/p/w300/" + actor.img} alt={actor.name}></img>
            <div className="flex--full-width margin-element--left-large">
                <div className="flex flex--align-center margin-element--bottom-large">
                    <h1>{actor.name}</h1>
                </div>
                {actor.birthday && <p>Birthday: {moment(actor.birthday).format("DD. MM. YYYY")} (Age: {moment(moment.now()).diff(actor.birthday, 'years', false)}) </p>}
                <p>Gender: {actor.gender}</p>
                {actor.biography && <div>Biography:
                    <TextShowMore text={actor.biography}></TextShowMore>
                </div>}
                {actor.cast_movies > 1 && <p>Act in {actor.cast_movies.length} movie{actor.cast_movies.length > 1 ? "s" : ""}</p>}
                {actor.crew_movies > 1 && <p>Contribute in {actor.crew_movies.length} movie{actor.crew_movies.length > 1 ? "s" : ""}</p>}
                <p>Known for: {actor.cast_movies ? "Acting, " : ""}{Array.from(new Set(actor.crew_movies.map((item) => item.role + ", ")))}</p>
            </div>
            {userDetail && userDetail.role === "ADMIN" && <div><button className='button button--red' onClick={redirectToEdit}>Edit</button></div>}
        </div>}

        {actor && (actor.cast_movies.length > 0 || userDetail.role === "ADMIN") && <h4>Act in:</h4>}
        {actor && actor.cast_movies && <Scroller removeHandler={removeCast} addMovieActorHandler={addActorMovie} data={actor.cast_movies} redirectHandler={e => redirectToMovieHandler(e)}></Scroller>}
        {actor && (actor.crew_movies.length > 0 || userDetail.role === "ADMIN") && <h4>Participated in creation of:</h4>}
        {actor && actor.crew_movies && <Scroller addMovieCrewHandler={addCrewMovie} removeHandler={removeCrew} data={actor.crew_movies} redirectHandler={e => redirectToMovieHandler(e)}></Scroller>}
    </div>;
}

export default ActorDetail;