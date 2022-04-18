import moment from "moment";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Select from "react-select";

function EditMovie() {
    const [data, setData] = useState({});
    const [genres, setGenres] = useState([]);
    const [isError, setError] = useState(false);
    const [isPending, setIsPending] = useState(true)
    const history = useHistory();
    const { id } = useParams();

    useLayoutEffect(() => {
        Promise.all(
            [fetch(`${process.env.REACT_APP_BASE_URI}/movie/${id}`),
            fetch(`${process.env.REACT_APP_BASE_URI}/genre/list`)]
        )
            .then(([res1, res2]) => {
                if (res1.ok && res2.ok)
                    return Promise.all([res1.json(), res2.json()])
            })
            .then(([res1, res2]) => {
                const movie = res1.result;
                const genres = res2.result.map(g => ({ value: g.id, label: g.name }))
                setGenres(genres)
                const newData = {
                    "title": movie.title,
                    "img": movie.img,
                    "release_date": movie.release_date,
                    "runtime": movie.runtime,
                    "description": movie.description,
                    "genres": genres.filter(genre =>  movie.genres.includes(genre.label)).map(genre => genre.value),
                    "id": movie.id
                }
                console.log(newData);
                setData({ ...newData })
            })
            .catch((err) => setError(err.message))
            .finally(_ => setIsPending(false))

    }, [])

    const handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        data[name] = value
        setData({ ...data })
    }

    const handleSelectChange = (event) => {
        const value = event.map(genre => genre.value);
        data["genres"] = value
        console.log(data);
        setData({ ...data })
    }

    const formValid = () => {
        if (!data["title"] ||
            !data["description"] ||
            !data["release_date"] ||
            !data["runtime"] ||
            !data["genres"]
        ) {
            return false;
        }

        return true;
    }

    const customStyles = {
        control: (provided, state) => ({
            display: 'flex',
            border: state.isFocused ? '2px solid red' : '',
            outline: 'none',
            borderRadius: '0.5rem'
        }),
    }

    const editMovie = (event) => {
        event.preventDefault()
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(id => history.push("/movies/" + id))

    }

    return <div className="login-form">
        <h2>Edit movie</h2>
        <form>
            <label htmlFor="title">Title</label>
            <input className="input" type={"text"} name={"title"} onChange={handleInputChange} value={data["title"]}/>
            <label htmlFor="img">Image</label>
            <input className="input" type={"text"} name={"img"} onChange={handleInputChange} value={data["img"]}/>
            <label htmlFor="description">Description</label>
            <textarea className="input" rows={10} name={"description"} onChange={handleInputChange} value={data["description"]}/>
            <label htmlFor="release_date">Release date</label>
            <input className="input" type={"date"} name={"release_date"} onChange={handleInputChange} value={data["release_date"] ? moment(data["release_date"]).format("YYYY-MM-DD") : "" }/>  
            <label htmlFor="runtime">Runtime</label>
            <input className="input" type={"number"} name={"runtime"} onChange={handleInputChange} value={data["runtime"]}/>
            <label htmlFor="genres">Genres</label>
            <Select name={"genres"} options={genres} isMulti isSearchable className="basic-multi-select" styles={customStyles} onChange={handleSelectChange} value={data["genres"] ? genres.filter(g => data["genres"].includes(g.value)) : null} />
            <div className="flex flex--justify-end">
                <button className="button button--red margin-element--top" disabled={!formValid()} onClick={editMovie}>Edit</button>
            </div>
            {isError}
        </form>
    </div>;
}

export default EditMovie;