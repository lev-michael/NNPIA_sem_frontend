import moment from "moment";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Select from "react-select";

function EditActor() {
    const [data, setData] = useState({});
    const history = useHistory();
    const { id } = useParams();

    useLayoutEffect(() => {
        console.log(id);
        fetch(`${process.env.REACT_APP_BASE_URI}/person/${id}`)
            .then((res) => res.json())
            .then((res) => {
                const actor = res.result;
                const newData = {
                    "name": actor.name,
                    "img": actor.img,
                    "gender": actor.gender,
                    "birthday": actor.birthday,
                    "biography": actor.biography,
                    "id": actor.id
                }
                setData({ ...newData })
            }
            )
    }, [])

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
        console.log(event);
        let newData = { ...data };
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
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
    ]

    const editActor = (event) => {
        event.preventDefault()
        fetch(`${process.env.REACT_APP_BASE_URI}/person/edit`, {
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
            .then(id => history.push("/actors/" + id))

    }

    return <div className="login-form">
        <h2>Edit actor</h2>
        <form>
            <label htmlFor="name">Name</label>
            <input className="input" type={"text"} name={"name"} onChange={handleInputChange} value={data["name"]} />
            <label htmlFor="biography">Biography</label>
            <textarea className="input" rows="10" name={"biography"} onChange={handleInputChange} value={data["biography"] ?? ""} />
            <label htmlFor="gender">Gender</label>
            <Select name={"gender"} options={genders} className="basic-multi-select" styles={customStyles} onChange={handleSelectChange} value={genders.find(g => g.value === data["gender"])} />
            <label htmlFor="birthday">Birthday</label>
            <input className="input" type={"date"} name={"birthday"} onChange={handleInputChange} value={data["birthday"] ? moment(data["birthday"]).format("yyyy-MM-DD") : ""} />
            <label htmlFor="img">Image</label>
            <input className="input" type={"text"} name={"img"} onChange={handleInputChange} value={data["img"] ?? ""} />
            <div className="flex flex--justify-end">
                <button className="button button--red margin-element--top" disabled={!formValid()} onClick={editActor}>Edit</button>
            </div>

        </form>
    </div>;
}

export default EditActor;