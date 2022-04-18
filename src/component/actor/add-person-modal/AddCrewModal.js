import { useLayoutEffect, useState } from "react";
import Modal from "react-modal/lib/components/Modal";
import Select from 'react-select';

function AddCrewModal({ modalIsOpen, closeModal, addHandler }) {
    const [persons, setPersons] = useState();
    const [crew, setCrew] = useState();
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
        fetch(`${process.env.REACT_APP_BASE_URI}/person/ids`)
            .then(res => res.json())
            .then(actors => {
                setPersons(actors.result.map(a => ({ value: a.id, label: a.name })))
            })
    }, [])

    const selectActorHandler = (actor) => {
        fetch(`${process.env.REACT_APP_BASE_URI}/person/${actor.value}`)
            .then((res) => res.json())
            .then((person) => {
                setCrew(person.result);
                handleInputChange({ target: { name: 'person_id', value: actor.value } })
            })
    }

    const isValid = () => {
        if (!data ||
            !data["person_id"]
            || !data["role"]
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
            <label htmlFor="person_id">Select actor</label>
            <Select name="person_id" options={persons} isSearchable className="basic-multi-select" onChange={selectActorHandler}></Select>
            {crew && <div className="actor margin-element text--centered">
                <div>
                    <img src={"http://image.tmdb.org/t/p/w300/" + crew.img} alt={crew.name}></img>
                </div>
                <div className="flex flex--space-between">
                    <div className="margin-element--left-small">
                        {crew.name !== undefined && <p className="text text--label">{crew.name}</p>}
                    </div>
                </div>
            </div>}
            <label htmlFor="role">Role</label>
            <input className="input" type={"text"} name={"role"} onChange={handleInputChange} />
            <div className="flex flex--justify-end margin-element">
                <button className="button button--red" disabled={!isValid()} onClick={e => addActor(e)}>Add actor</button>
            </div>
        </Modal>
    </div>;
}

export default AddCrewModal;