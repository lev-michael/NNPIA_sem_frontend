import Movie from "./Movie"
import "../../helpers.scss"
import React, { useLayoutEffect, useState } from "react";

function MovieList() {

    const [movies, setMovies] = useState([])
    const [isPending, setIsPending] = useState(true)
    const [error, setError] = useState();

    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/list`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Unable to get data: ${response.statusText}`)
            })
            .then(json => {
                console.log(json);
                setMovies(json.content)
            })
            .catch((err) => setError(err.message))
            .finally(() => setIsPending(false))

    }, [])

    return <div>
        {isPending && "Loading data..."}
        {error}
        <div className="flex">
            {movies && movies.map(movie => <Movie key={movie.id} movie={movie}></Movie>)}
        </div>
    </div>
}

export default MovieList;