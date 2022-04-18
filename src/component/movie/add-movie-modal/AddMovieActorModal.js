import moment from "moment";
import { useLayoutEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import Select from 'react-select';

function AddMovieActorModal({ modalIsOpen, closeModal, addHandler }) {
    const [movies, setMovies] = useState();
    const [movie, setMovie] = useState();
    const [data, setData] = useState();

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#121212',
        },
        overlay: {
            backgroundColor: 'rgba(120, 120, 120, 0.75)',
            backdropFilter: 'blur(2px)'
        },
    };

    useLayoutEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/ids`)
            .then(res => res.json())
            .then(movies => {
                setMovies(movies.result.map(m => ({ value: m.id, label: m.title })))
            })
    }, [])

    const selectMovieHandler = (movie) => {
        fetch(`${process.env.REACT_APP_BASE_URI}/movie/${movie.value}`)
            .then((res) => res.json())
            .then((m) => {
                setMovie(m.result)
                handleInputChange({ target: { name: 'movie_id', value: movie.value } })
            })
    }

    const isValid = () => {
        if (!data ||
            !data["movie_id"]
            || !data["cast_order"]
            || data["cast_order"] < 1
            || !data["character_name"]
        ) return false;

        return true;
    }

    const handleInputChange = (event) => {
        const newData = { ...data };
        const value = event.target.value;
        const name = event.target.name;
        newData[name] = value
        setData({ ...newData })
    }

    const addActor = (event) => {
        event.preventDefault();
        addHandler(data);
        closeModal();
    }

    return <div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}>
            <label htmlFor="person_id">Select movie</label>
            <Select name="person_id" options={movies} isSearchable className="basic-multi-select" onChange={selectMovieHandler}></Select>
            {movie && <div className="actor margin-element text--centered">
                <div>
                    <img src={"http://image.tmdb.org/t/p/w300/" + movie.img} alt={movie.name}></img>
                </div>
                <div className="flex flex--space-between">
                    <div className="margin-element--left-small">
                        {movie.title !== undefined && <p className="text text--label">{movie.title}</p>}
                        {movie.release_data !== undefined && <p className="text text--label">{moment(movie.release_data).format("DD. MM. YYYY")}</p>}
                    </div>
                </div>
            </div>}
            <label htmlFor="character_name">Character name</label>
            <input className="input" type={"text"} name={"character_name"} onChange={handleInputChange} />
            <label htmlFor="cast_order">Order</label>
            <input className="input" type={"number"} name={"cast_order"} onChange={handleInputChange} />
            <div className="flex flex--justify-end margin-element">
                <button className="button button--red" disabled={!isValid()} onClick={e => addActor(e)}>Add actor</button>
            </div>
        </Modal>
    </div>;
}

export default AddMovieActorModal;