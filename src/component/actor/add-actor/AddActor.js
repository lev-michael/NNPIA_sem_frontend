import { useState } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";

function AddActor({actor}) {
    const [data, setData] = useState({});
    const history = useHistory();

    const handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        data[name] = value
        setData({ ...data })
    }

    const formValid = () => {
        if (!data["name"] ||
            !data["birthday"] ||
            !data["gender"]
        ) {
            return false;
        }

        return true;
    }

    const handleSelectChange = (event) => {
        let newData = {...data};
        const value = event.value;
        newData["gender"] = value
        setData({ ...newData })
    }

    const customStyles = {
        control: (provided, state) => ({
            display: 'flex',
            border: state.isFocused ? '2px solid red' : '',
            outline: 'none',
            borderRadius: '0.5rem'
        }),
    }

    const genders = [
        {value: "MALE", label: "Male"},
        {value: "FEMALE", label: "Female"},
    ]

    const addActor = (event) => {
        event.preventDefault()
        fetch(`${process.env.REACT_APP_BASE_URI}/person/add`, {
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
            .then(id => history.push("/actors/" + id.result))

    }

    return <div className="login-form">
        <h2>Add actor</h2>
        <form>
            <label htmlFor="name">Name</label>
            <input className="input" type={"text"} name={"name"} onChange={handleInputChange}/>
            <label htmlFor="biography">Biography</label>
            <textarea className="input" rows={10} name={"biography"} onChange={handleInputChange} />
            <label htmlFor="gender">Gender</label>
            <Select name={"gender"} options={genders} className="basic-multi-select" styles={customStyles} onChange={handleSelectChange} />
            <label htmlFor="birthday">Birthday</label>
            <input className="input" type={"date"} name={"birthday"} onChange={handleInputChange} />
            <label htmlFor="img">Image</label>
            <input className="input" type={"text"} name={"img"} onChange={handleInputChange} />
            <div className="flex flex--justify-end">
                <button className="button button--red margin-element--top" disabled={!formValid()} onClick={addActor}>Add</button>
            </div>
        
        </form>
    </div>;
}

export default AddActor;