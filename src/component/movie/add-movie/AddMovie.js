import { useLayoutEffect, useState } from "react";
import Select from 'react-select';
import "./AddMovie.scss";

function AddMovie() {
    const [data, setData] = useState({});
    const [genres, setGenres] = useState([]);
    const [isError, setError] = useState(false);
    const [isPending, setIsPending] = useState(true)

    useLayoutEffect(() => {
        setIsPending(true);
        fetch(`${process.env.REACT_APP_BASE_URI}/genre/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(res => {
                const g = res.result.map(g => ({ value: g.id, label: g.name }))
                setGenres(g)
                setError(null)
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

    const addMovie = (event) => {
        event.preventDefault()
        setIsPending(true)
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("tokens")}`
            },
            body: JSON.stringify({ ...data })
        })
            .then(response => {
                if (response.ok) {
                    setError(null);
                }
            })
            .catch((err) => setError(err.message))
            .finally(_ => setIsPending(false))
    }

    return <div className="login-form">
        <h2>Add movie</h2>
        <form>
            <label htmlFor="title">Title</label>
            <input className="input" type={"text"} name={"title"} onChange={handleInputChange} />
            <label htmlFor="img">Image</label>
            <input className="input" type={"text"} name={"img"} onChange={handleInputChange} />
            <label htmlFor="description">Description</label>
            <textarea className="input" rows={10} name={"description"} onChange={handleInputChange} />
            <label htmlFor="release_date">Release date</label>
            <input className="input" type={"date"} name={"release_date"} onChange={handleInputChange} />
            <label htmlFor="runtime">Runtime</label>
            <input className="input" type={"number"} name={"runtime"} onChange={handleInputChange} />
            <label htmlFor="genres">Genres</label>
            <Select name={"genres"} options={genres} isMulti isSearchable className="basic-multi-select" styles={customStyles} onChange={handleSelectChange} />
            <div className="flex flex--justify-end">
                <button className="button button--red margin-element--top" disabled={!formValid()} onClick={addMovie}>Add</button>
            </div>
            {isError}
        </form>
    </div>;
}

export default AddMovie;